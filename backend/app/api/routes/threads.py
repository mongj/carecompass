from typing import Optional
from fastapi import APIRouter, HTTPException
from sse_starlette.sse import EventSourceResponse
from openai import OpenAI
from openai import NotFoundError
from pydantic import BaseModel, ConfigDict

from app.util.openai import remove_citation, stream_chat_responses
from app.core.database import db_dependency
from app.models import User, Thread

router = APIRouter()
client = OpenAI()


# Pydantic models
class ChatCompletionRequest(BaseModel):
    query: str

class ThreadCreateRequest(BaseModel):
    user_id: str

class ThreadCreateResponse(BaseModel):
    thread_id: str

class ThreadBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)

    title: Optional[str] = None
    thread_id: str

class ThreadReadResponse(ThreadBase):
    pass


# Routes
@router.post('/threads')
async def create_thread(
    req: ThreadCreateRequest, 
    db: db_dependency
) -> ThreadCreateResponse:
    user = db.query(User).filter(User.clerk_id == req.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    
    new_thread = client.beta.threads.create()

    thread = Thread(thread_id=new_thread.id, user_id=req.user_id)
    db.add(thread)
    db.commit()

    return ThreadCreateResponse(thread_id=new_thread.id)


@router.get('/threads/{thread_id}/messages')
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


@router.post('/threads/{thread_id}/messages')
async def create_message(thread_id: str, req: ChatCompletionRequest, db: db_dependency) -> EventSourceResponse:
    # Add the query as the title of the thread, if it's not already set
    thread = db.get(Thread, thread_id)
    
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    if not thread.title:
        thread.title = req.query
        db.add(thread)
        db.commit()

    return EventSourceResponse(stream_chat_responses(thread_id, req.query))

