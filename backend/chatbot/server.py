from contextlib import asynccontextmanager
import json
import os
import re

from sqlmodel import select
from database import *
from typing import AsyncGenerator
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from openai import OpenAI
from openai import NotFoundError
from openai.types.beta.assistant_stream_event import (
    ThreadMessageDelta,
    ThreadRunFailed,
    ThreadRunCancelling,
    ThreadRunCancelled,
    ThreadRunExpired,
    ThreadRunStepFailed,
    ThreadRunStepCancelled,
)
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class ChatCompletionRequest(BaseModel):
    query: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

# TODO: use env variables
origins = [
    "http://localhost:3000",
    "https://carecompass.mingjun.dev",
    "https://app.carecompass.sg",
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

client = OpenAI()

@app.get('/ping')
async def ping():
    return 'pong'

class ThreadCreateRequest(BaseModel):
    user_id: str

class ThreadCreateResponse(BaseModel):
    thread_id: str

@app.post('/threads')
async def create_thread(req: ThreadCreateRequest, session: SessionDep):
    statement = select(User).where(User.clerk_id == req.user_id)
    result = session.exec(statement)
    user = result.one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    
    new_thread = client.beta.threads.create()

    thread = Thread(thread_id=new_thread.id, user_id=req.user_id)
    session.add(thread)
    session.commit()
    session.refresh(thread)

    return ThreadCreateResponse(thread_id=new_thread.id)


# Temporary solution to remove citation from the openai response
def remove_citation(text: str) -> str:
    return re.sub(r'【.*】', '', text)

@app.get('/threads/{thread_id}/messages')
async def thread_messages(thread_id: str):
    try:
        thread_messages = client.beta.threads.messages.list(thread_id)
        extracted_values = []
        for message in thread_messages:
            for content_block in message.content:
                extracted_values.append({
                    "id": message.id,
                    "role": message.role,
                    "content": remove_citation(content_block.text.value)
                })

        extracted_values.reverse()
        return extracted_values
    except Exception as e:
        if isinstance(e, NotFoundError):
            raise HTTPException(status_code=404, detail="Thread is not found")
        return HTTPException(status_code=500, detail="Internal server error")

async def stream_chat_responses(thread_id: str, query: str) -> AsyncGenerator[str, None]:
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=query
    )

    stream = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=os.getenv('OPENAI_ASSISTANT_ID'),
        stream=True,
        response_format={ "type": "text" }
    )

    for event in stream:
        async for token in process_event(event):
            print(token, flush=True, end="")
            yield json.dumps({ "token": token })
        

async def process_event(event):
        if isinstance(event, ThreadMessageDelta):
            data = event.data.delta.content
            for d in data:
                yield d.text.value

        elif any(
            isinstance(event, cls)
            for cls in [
                ThreadRunFailed,
                ThreadRunCancelling,
                ThreadRunCancelled,
                ThreadRunExpired,
                ThreadRunStepFailed,
                ThreadRunStepCancelled,
            ]
        ):
            raise Exception("Run failed")

@app.post('/threads/{thread_id}/messages')
async def create_message(thread_id: str, req: ChatCompletionRequest, session: SessionDep) -> EventSourceResponse:
    # Add the query as the title of the thread, if it's not already set
    thread = session.get(Thread, thread_id)
    
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    if not thread.title:
        thread.title = req.query
        session.add(thread)
        session.commit()
        session.refresh(thread)

    return EventSourceResponse(stream_chat_responses(thread_id, req.query))


@app.post("/users/")
def create_user(user: User, session: SessionDep) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@app.get("/users/{id}")
def read_user(id: str, session: SessionDep) -> User:
    statement = select(User).where(User.clerk_id == id)
    result = session.exec(statement)
    user = result.one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    return user

class ThreadResponse(BaseModel):
    thread_id: str
    title: str

    class Config:
        from_attributes = True

@app.get("/users/{id}/threads", response_model=List[ThreadResponse])
def read_userthreads(id: str, session: SessionDep) -> User:
    statement = select(User).where(User.clerk_id == id)
    result = session.exec(statement)
    user = result.one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    return user.threads