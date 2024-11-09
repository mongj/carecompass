import logging
import os
import requests

from typing import List, Optional, Tuple
from pydantic import BaseModel

from updater import sync, sync_ddc, sync_reviews
from models import Place, DaycareAddress, DementiaDaycare, Review

class PlaceResponse(BaseModel):
    places: List[Place]

def get_daycare_addresses() -> List[DaycareAddress]:
    backend_url = os.getenv("BACKEND_URL")
    if not backend_url:
        raise ValueError("BACKEND_URL environment variable is not set")
    
    endpoint = f"{backend_url}/services/dementia-daycare/addresses"
    
    try:
        response = requests.get(endpoint, timeout=30)
        response.raise_for_status()
        
        # Parse the response data
        addresses = [
            DaycareAddress(
                id=item.get("id"),
                name=item.get("name"),
                address=item.get("address")
            )
            for item in response.json()
        ]
        
        return addresses
        
    except requests.exceptions.HTTPError as e:
        logging.error(f"HTTP error occurred while fetching addresses: {str(e)}")
        raise
    except requests.exceptions.RequestException as e:
        logging.error(f"Error occurred while fetching addresses: {str(e)}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error while fetching addresses: {str(e)}")
        raise

def fetch_place_details(query: str) -> Optional[Place]:
    """
    Fetch place details from Google Maps Places API for a given daycare address.
    
    Args:
        daycare_address (DaycareAddress): The daycare address to search for
        
    Returns:
        Optional[Place]: Place details if found, None if no match
        
    Raises:
        RequestException: If the API request fails
        ValueError: If the GOOGLE_MAPS_API_KEY environment variable is not set
    """
    logging.info(f"Fetching place details for {query}")

    api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_MAPS_API_KEY environment variable is not set")

    url = 'https://places.googleapis.com/v1/places:searchText'
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': api_key,
        'X-Goog-FieldMask': 'places.id,places.addressComponents,places.regularOpeningHours,places.regularSecondaryOpeningHours,places.nationalPhoneNumber,places.websiteUri,places.rating,places.reviews,places.photos'
    }
    
    data = {
        'textQuery': query
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        response_data = response.json()

        # Return None if no places found
        if not response_data or not response_data.get('places'):
            return None
        
        place_response = PlaceResponse(**response_data)
        
        # Return the first place if any matches found
        if place_response.places:
            return place_response.places[0]
        return None
        
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching place details for {query}: {str(e)}")
    except Exception as e:
        logging.error(f"Unexpected error while fetching place details for {query}: {str(e)}")

def fetch_places_data() -> List[Tuple[int, Place]]:
    addresses = get_daycare_addresses()
    places: List[Tuple[int, Place]] = []
    for address in addresses:
        place = fetch_place_details(f"{address.name} {address.address}")
        if place:
            places.append((address.id, place))

    return places

def fetch_image(name: str):
    api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_MAPS_API_KEY environment variable is not set")

    url = f"https://places.googleapis.com/v1/{name}/media?key={api_key}&max_height_px=1080&skipHttpRedirect=true"
    response = requests.get(url)

    try:
        return response.json().get('photoUri')
    except Exception as e:
        logging.error(f"Error fetching image: {str(e)}")

def process_place(place: Place, centre_id: int) -> DementiaDaycare:
    """
    Process Google Maps place data into DementiaDaycare model
    
    Args:
        place (Place): Google Maps place data
        centre_id (int): The ID of the day care centre in the database
        
    Returns:
        DementiaDaycare: Processed daycare data
    """

    block = None
    street_name = None
    building_name = None
    unit_no = None
    postal_code = None
    
    # Process address components
    for component in place.addressComponents:
        types = component.types
        
        if 'subpremise' in types:
            unit_no = component.longText
        elif 'street_number' in types:
            block = component.longText
        elif 'route' in types:
            street_name = component.longText
        elif 'postal_code' in types:
            postal_code = component.longText

    # Process photos
    photo_urls = []
    if place.photos:
        photo_urls = [url for photo in place.photos if (url := fetch_image(photo.name))]
    
    # Process reviews
    reviews = []
    if place.reviews:
        for review_data in place.reviews:
            review = Review(
                target_id=centre_id,
                # TODO: Do not hardcode this!!
                target_type="CARESERVICE::DEMENTIA_DAY_CARE",
                content=review_data.text.text if review_data.text else None,
                overall_rating=review_data.rating,
                google_review_id=review_data.name.split('/')[-1],
                google_author_name=review_data.authorAttribution.displayName,
                google_author_url=review_data.authorAttribution.uri,
                google_author_photo_url=review_data.authorAttribution.photoUri,
                published_time=review_data.publishTime
            )
            reviews.append(review)

    # Clean URL
    if place.websiteUri:
        place.websiteUri = f"{place.websiteUri.scheme}://{place.websiteUri.host}{place.websiteUri.path}"
    
    # Create and return DementiaDaycare instance
    return DementiaDaycare(
        website=place.websiteUri,
        phone=place.nationalPhoneNumber,
        operating_hours=place.regularOpeningHours.weekdayDescriptions if place.regularOpeningHours else None,
        building_name=building_name,
        block=block,
        street_name=street_name,
        unit_no=unit_no,
        postal_code=postal_code,
        photos=photo_urls,
        google_map_place_id=place.id,
        reviews=reviews
    )

def fetch_and_sync_places_data():
    places = fetch_places_data()
    for index, (centre_id, place) in enumerate(places):
        # centre_id is the id of the daycare centre in the database
        daycare_centre = process_place(place, centre_id)
        logging.info(f"Syncing data for place ({index + 1}/{len(places)}): {place.id}")
        sync_ddc(centre_id, daycare_centre)
        if daycare_centre.reviews:
            sync_reviews(daycare_centre.reviews)