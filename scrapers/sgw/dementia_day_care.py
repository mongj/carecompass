import requests

from typing import List, Optional
from pydantic import BaseModel

from updater import sync

class DementiaDaycareCentre(BaseModel):
    friendly_id: str
    name: str
    lat: float
    lng: float
    postal_code: str
    operating_hours: List[str]
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    building_name: Optional[str] = None
    block: Optional[str] = None
    street_name: Optional[str] = None
    unit_no: Optional[str] = None
    availability: Optional[str] = None

def fetch_daycare_data() -> List[DementiaDaycareCentre]:
    """
    Fetches dementia daycare data from SGW API and transforms it into DementiaDaycareCentre models.
    """

    # TODO: Move the API URL to a config file
    url = "https://api.supportgowhere.life.gov.sg/v1/sr/services/details"
    params = {
        "serviceId": "SVC-DDC",
        "lang": "en"
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.json()
        
        # Extract locations from the response
        locations = data.get("locations", [])
        
        # Transform each location into a DementiaDaycareCentre model
        daycares = []
        for location in locations:
            daycare = DementiaDaycareCentre(
                friendly_id=location.get("friendlyId"),
                name=location.get("name"),
                lat=location.get("lat"),
                lng=location.get("lng"),
                postal_code=location.get("postalCode"),
                operating_hours=location.get("operatingHours", []),
                phone=location.get("phone"),
                email=location.get("email"),
                website=location.get("website"),
                building_name=location.get("buildingName"),
                block=location.get("block"),
                street_name=location.get("streetName"),
                unit_no=location.get("unitNo"),
                availability=location.get("availability"),
            )
            daycares.append(daycare)
        
        return daycares
    
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return []

def fetch_and_sync_daycare_data():
    """
    Fetches dementia daycare data from the SGW API and syncs with the database.
    """
    daycares = fetch_daycare_data()
    for i, daycare in enumerate(daycares):
        print(f"Syncing dementia daycare ({i + 1}/{len(daycares)}): {daycare.name}")
        sync("http://127.0.0.1:8000/services/dementia-daycare", daycare)