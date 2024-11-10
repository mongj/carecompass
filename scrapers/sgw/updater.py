from typing import TypeVar
from requests import Response, put
from pydantic import BaseModel

T = TypeVar('T', bound=BaseModel)

def sync(url: str, model: BaseModel) -> Response:
    """
    Makes a PUT request to CareCompass API with the Pydantic model data.
    
    Args:
        url (str): The URL to make the request to
        model (BaseModel): The Pydantic model instance to send
    
    Returns:
        requests.Response: The response from the server
        
    Raises:
        requests.RequestException: If the request fails
        ValueError: If the model is not a Pydantic BaseModel
    """
    if not isinstance(model, BaseModel):
        raise ValueError("The provided model must be a Pydantic BaseModel instance")
    
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    try:
        response: Response = put(
            url,
            data=model.model_dump_json(),
            headers=headers,
            timeout=30
        )

        if not response.ok:
            print(f"Request failed with status code {response.status_code}: {response.json()['detail']}")
            # TODO: Log the error to sentry
        
        return response
        
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise