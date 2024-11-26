from contextlib import asynccontextmanager
import sentry_sdk

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import router
from app.core.config import config
from app.core.database import test_db_connection

sentry_sdk.init(
    dsn=config.SENTRY_DSN,
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for tracing.
    traces_sample_rate=1.0,
    _experiments={
        # Set continuous_profiling_auto_start to True
        # to automatically start the profiler on when
        # possible.
        "continuous_profiling_auto_start": True,
    },
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for the FastAPI application.
    Handles database connection testing on startup.
    """
    test_db_connection()
    
    yield

app = FastAPI(
    title="CareCompass API",
    lifespan=lifespan,
)

# TODO: use env variables
origins = [
    "http://localhost:3000",
    "https://my.carecompass.sg",
    "https://prod-frontend.carecompass.sg",
    "https://staging-frontend.carecompass.sg",
    "https://carecompass-bfg.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    # TODO: update this to only allow specific methods and headers
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Exception handler for all uncaught exceptions
async def base_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
        },
    )

app.add_exception_handler(Exception, base_exception_handler)