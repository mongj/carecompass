from fastapi import APIRouter
from app.api.routes.subsidies import moh_nrltc

router = APIRouter(prefix="/subsidies", tags=["subsidies"])

router.include_router(moh_nrltc.router)