from fastapi import APIRouter
from app.api.routes.services import dementia_daycare

router = APIRouter(prefix="/services", tags=["services"])

router.include_router(dementia_daycare.router)