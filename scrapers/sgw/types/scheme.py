from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from datetime import datetime

@dataclass
class SchemeMeta:
    checkStatus: bool
    applicationNeeded: bool

@dataclass
class MetaData:
    SGW: SchemeMeta

@dataclass
class Document:
    type: str
    content: List[Dict[str, Any]]
    
@dataclass
class Scheme:
    # Basic information
    title: str
    title_en: str
    description: str
    
    # Identifiers and categorization
    friendlyId: str
    agencies: List[str]
    categories: List[str]
    
    # URLs and application details
    applicationUrl: Optional[str]
    detailsUrl: str
    
    # Metadata
    infoLastUpdated: datetime
    meta: MetaData
    
    # Location information
    postalCode: Optional[str]
    address: Optional[str]
    
    # Contact and application information
    agencyWebsite: str
    emailOrForm: str
    phoneNumber: str
    
    # Benefits and eligibility
    highlights: List[str]
    howToApply: str
    whatAreBenefits: str
    whoIsEligible: str