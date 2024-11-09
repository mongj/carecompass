from typing import List, Optional
from datetime import datetime
from urllib.parse import urlparse, urlunparse
from pydantic import BaseModel, HttpUrl, field_validator, validator

class AddressComponent(BaseModel):
    longText: str
    shortText: str
    types: List[str]
    languageCode: str

class Period(BaseModel):
    open: Optional[dict] = None
    close: Optional[dict] = None

class RegularOpeningHours(BaseModel):
    openNow: Optional[bool] = None
    periods: Optional[List[Period]] = None
    weekdayDescriptions: Optional[List[str]] = None
    nextOpenTime: Optional[str] = None

class AuthorAttribution(BaseModel):
    displayName: str
    uri: HttpUrl
    photoUri: HttpUrl

class Text(BaseModel):
    text: str
    languageCode: str

class Review(BaseModel):
    name: str
    relativePublishTimeDescription: str
    rating: int
    text: Optional[Text] = None
    originalText: Optional[Text] = None
    authorAttribution: AuthorAttribution
    publishTime: datetime
    flagContentUri: HttpUrl
    googleMapsUri: HttpUrl

class PhotoAuthorAttribution(BaseModel):
    displayName: str
    uri: str
    photoUri: HttpUrl

class Photo(BaseModel):
    name: str
    widthPx: int
    heightPx: int
    authorAttributions: List[PhotoAuthorAttribution]
    flagContentUri: HttpUrl
    googleMapsUri: HttpUrl

class Place(BaseModel):
    id: str
    addressComponents: List[AddressComponent]
    rating: Optional[float] = None
    nationalPhoneNumber: Optional[str] = None
    websiteUri: Optional[HttpUrl] = None
    regularOpeningHours: Optional[RegularOpeningHours] = None
    reviews: Optional[List[Review]] = None
    photos: Optional[List[Photo]] = None
