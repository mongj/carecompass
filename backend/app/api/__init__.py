from fastapi import APIRouter, HTTPException

from app.api.routes import users, threads, reviews, services, bookmarks

router = APIRouter()

router.include_router(users.router)
router.include_router(threads.router)
router.include_router(reviews.router)
router.include_router(services.router)
router.include_router(bookmarks.router)

@router.get("/")
async def root():
    raise HTTPException(status_code=418, detail="not enough coffee")