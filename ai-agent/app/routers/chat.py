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
        response_data = gemini.chat(gemini_messages)
        return response_data

    async def event_generator():
        # 비동기 제너레이터를 순회하며 SSE 형식으로 yield
        async for data in gemini.chat_stream(gemini_messages):
            if data:
                yield {"data": json.dumps(data, ensure_ascii=False)}
        yield {"data": "[DONE]"}

    return EventSourceResponse(event_generator())
