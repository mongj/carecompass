from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router

app = FastAPI()

from dotenv import load_dotenv

load_dotenv("../.env")

app = FastAPI(
    title="CareCompass API",
)

# TODO: use env variables
origins = [
    "http://localhost:3000",
    "https://my.carecompass.sg",
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
