# not integrated with main.py yet
# this was previously used to get a json file to store on the frontend

import json
import os
import random
import requests
from dotenv import load_dotenv

def fetch_image(name, width):
    response = requests.get("https://places.googleapis.com/v1/" + name + "/media?key=" + os.getenv("GOOGLE_MAPS_API_KEY") + "&maxWidthPx=" + str(width) + "&skipHttpRedirect=true")
    res = response.json()
    return res

# Define a parser function
def parse_google_map_response(data):
    places_data = []
    
    for place in data.get('places', []):
        place_info = {
            'place_id': place.get('id'),
            'display_name': place.get('displayName', {}).get('text'),
            'rating_count': place.get('userRatingCount'),
            'reviews': [],
            'photos': []
        }
        
        # Parse reviews
        for review in place.get('reviews', []):
            review_info = {
                'author': review.get('authorAttribution', {}).get('displayName'),
                'rating': review.get('rating'),
                'review_text': review.get('text', {}).get('text'),
                'relative_time': review.get('relativePublishTimeDescription'),
                'publish_time': review.get('publishTime'),
                'author_photo': review.get('authorAttribution', {}).get('photoUri'),
                'author_uri': review.get('authorAttribution', {}).get('uri')
            }
            place_info['reviews'].append(review_info)
        
        # Parse photos
        for photo in place.get('photos', []):
            # fetch photo data
            apiData = fetch_image(photo.get('name'), photo.get('widthPx'))
            place_info['photos'].append(apiData['photoUri'])
        
        places_data.append(place_info)
    
    return places_data

def fetchCentreDetails(query):
    url = 'https://places.googleapis.com/v1/places:searchText'
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': os.getenv('GOOGLE_MAPS_API_KEY'),
        'X-Goog-FieldMask': 'places.id,places.displayName,places.photos,places.reviews,places.userRatingCount'
    }
    data = {
        'textQuery': query
    }

    response = requests.post(url, headers=headers, json=data)

    res = response.json()

    parsed_data = parse_google_map_response(res)

    return parsed_data

# Function to generate random price and dropoff/pickup options
def transform_data(data):
    transformed = []
    count = 1
    for center in data:
        print(f"Processing center {center['name']} ({count}/{len(data)})")
        mapsApiInfo = fetchCentreDetails(center["name"] + " " + center["streetName"] + " " + center["postalCode"])
        transformed_center = {
            "friendlyId": center["friendlyId"],
            "buildingName": center["buildingName"] if center["buildingName"] else None,
            "email": center["email"] if center["email"] else None,
            "lat": center["lat"],
            "lng": center["lng"],
            "name": center["name"],
            "operatingHours": center["operatingHours"],
            "phone": center["phone"],
            "postalCode": center["postalCode"],
            "streetName": center["streetName"],
            "unitNo": center["unitNo"] if center["unitNo"] else None,
            "website": center["website"] if center["website"] else None,
            "availability": center["availability"],
            "block": center["block"] if center["block"] else None,
            "priceNoTransport": round(random.uniform(20, 30)),
            "priceWithOneWayTransport": round(random.uniform(23, 31)),
            "priceWithTwoWayTransport": round(random.uniform(25, 33)),
            "dropoffPickupAvailability": random.sample(["Pickup", "Dropoff"], random.randint(1, 2)),  # Random choice of Pickup, Dropoff, or both
        }

        if mapsApiInfo:
            place_info = mapsApiInfo[0] if len(mapsApiInfo) > 0 else {}
            transformed_center["place_id"] = place_info.get("place_id")
            transformed_center["display_name"] = place_info.get("display_name")
            transformed_center["rating_count"] = place_info.get("rating_count")
            transformed_center["reviews"] = place_info.get("reviews", [])
            transformed_center["photos"] = place_info.get("photos", [])
        
        transformed.append(transformed_center)
        count += 1

    return transformed

# TODO: move env var to config
load_dotenv()

# Load the data from file
with open("raw.json") as f:
    data = json.load(f)

# Parse and transform the data
parsed_data = transform_data(data)

# Output the transformed data
with open("ddc.json", "w") as f:
    json.dump(parsed_data, f, indent=4)