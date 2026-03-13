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
        action = None
        # chat_stream yields str (텍스트) or dict (액션)
        async for chunk in gemini.chat_stream(gemini_messages):
            if isinstance(chunk, dict):
                # dict → 프론트엔드 액션 (나중에 전송)
                action = chunk
            elif chunk:
                # str → 텍스트 청크 (즉시 SSE 전송)
                yield {"data": json.dumps({"content": chunk}, ensure_ascii=False)}

        # 텍스트 이후에 액션 전송
        if action:
            yield {"data": json.dumps(action, ensure_ascii=False)}
        yield {"data": "[DONE]"}

    return EventSourceResponse(event_generator())
