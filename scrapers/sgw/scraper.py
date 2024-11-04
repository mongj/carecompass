from datetime import datetime
import requests
import json
from typing import List

from .types.scheme import MetaData, Scheme, SchemeMeta

reqUrl = "https://api.supportgowhere.life.gov.sg/v1/sr/schemes?lang=en"

def parse_schemes(json_data: str) -> List[Scheme]:
    data = json.loads(json_data)
    schemes = []

    # Fields to exclude from parsing
    excluded_fields = {'keywords', 'keywordsV2', 'bundles', 'bundleFriendlyIds', 'typeOfSupport', 'sortOrder'}
    
    for item in data:
        # Remove excluded fields from the dictionary
        item = {k: v for k, v in item.items() if k not in excluded_fields}

        # Convert string date to datetime
        item['infoLastUpdated'] = datetime.fromisoformat(item['infoLastUpdated'].replace('Z', '+00:00'))
        
        # Create SchemeMeta and MetaData objects
        meta_data = MetaData(
            SGW=SchemeMeta(
                checkStatus=item['meta']['SGW']['checkStatus'],
                applicationNeeded=item['meta']['SGW']['applicationNeeded']
            )
        )
        item['meta'] = meta_data
        
        # Create Scheme object
        scheme = Scheme(**item)
        schemes.append(scheme)
    
    return schemes

def fetch_schemes() -> List[Scheme]:
    response = requests.request("GET", reqUrl)
    return parse_schemes(response.text)