import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from app.models.schemas import ChatRequest
from app.services import gemini, rag_service

router = APIRouter()

def to_gemini_messages(messages):
    return [{"role": m.role, "parts": [{"text": m.content}]} for m in messages]

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # 1. 마지막 사용자 메시지 추출
    last_user_msg = next((m.content for m in reversed(request.messages) if m.role == "user"), "")
    
    # 2. RAG 검색 수행
    context = ""
    if last_user_msg:
        search_results = rag_service.search_documents(last_user_msg)
        if search_results:
            context_parts = ["관련 정보 (참고해서 답변해줘):"]
            for res in search_results:
                context_parts.append(f"[{res['title']}]: {res['content']}")
            context = "\n\n".join(context_parts)

    # 3. 메시지 변환
    gemini_messages = to_gemini_messages(request.messages)

    if not request.stream:
        response_data = gemini.chat(gemini_messages, context=context)
        return response_data

    async def event_generator():
        action = None
        # chat_stream yields str (텍스트) or dict (액션)
        async for chunk in gemini.chat_stream(gemini_messages, context=context):
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
