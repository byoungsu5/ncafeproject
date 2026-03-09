import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from app.models.schemas import ChatRequest
from app.services import gemini

router = APIRouter()

def to_gemini_messages(messages):
    return [{"role": m.role, "parts": [{"text": m.content}]} for m in messages]

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    gemini_messages = to_gemini_messages(request.messages)

    if not request.stream:
        response_text = gemini.chat(gemini_messages)
        return {"content": response_text}

    async def event_generator():
        # Iterate over the sync generator from gemini service
        for token in gemini.chat_stream(gemini_messages):
            yield {"data": json.dumps({"content": token}, ensure_ascii=False)}
        yield {"data": "[DONE]"}

    return EventSourceResponse(event_generator())
