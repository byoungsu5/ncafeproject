from google import genai
from google.genai import types
from typing import Generator, List, Dict, Any
from app import config

client = genai.Client(api_key=config.GEMINI_API_KEY)
# SSE 스트리밍을 위한 비동기 클라이언트 (v1alpha 필수)
async_client = genai.Client(
    api_key=config.GEMINI_API_KEY,
    http_options={'api_version': 'v1alpha'}
)

MODEL_NAME = getattr(config, "MODEL_NAME", "gemini-2.5-flash")

# Tool definitions
def add_to_cart(slug: str, quantity: int = 1):
    """
    장바구니에 메뉴를 추가합니다.
    Args:
        slug: 메뉴의 슬러그 (예: 'iced-americano')
        quantity: 추가할 수량 (기본값 1)
    """
    pass

def navigate_to(path: str):
    """
    애플리케이션의 특정 페이지로 이동합니다.
    Args:
        path: 이동할 경로 (예: '/', '/menus', '/cart', '/login')
    """
    pass

tools = [add_to_cart, navigate_to]

def chat(messages: list[dict]) -> dict:
    config_params = {
        "tools": tools,
    }
    
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=messages,
        config=config_params
    )
    
    res_data = {"content": response.text}
    
    # Check for function calls
    if response.candidates and response.candidates[0].content.parts:
        for part in response.candidates[0].content.parts:
            if part.function_call:
                if "calls" not in res_data:
                    res_data["calls"] = []
                res_data["calls"].append({
                    "name": part.function_call.name,
                    "args": part.function_call.args
                })
    
    return res_data

async def chat_stream(messages: list[dict]):
    config_params = types.GenerateContentConfig(
        tools=tools,
    )
    # 비동기 스트리밍 호출
    response = await async_client.aio.models.generate_content_stream(
        model=MODEL_NAME,
        contents=messages,
        config=config_params
    )
    async for chunk in response:
        res_data = {}
        if chunk.text:
            res_data["content"] = chunk.text
            
        if chunk.candidates and chunk.candidates[0].content.parts:
            for part in chunk.candidates[0].content.parts:
                if part.function_call:
                    if "calls" not in res_data:
                        res_data["calls"] = []
                        
                    # 파싱
                    args_dict = part.function_call.args if isinstance(part.function_call.args, dict) else dict(part.function_call.args)
                    res_data["calls"].append({
                        "name": part.function_call.name,
                        "args": args_dict
                    })
                    
        if res_data:
            yield res_data
