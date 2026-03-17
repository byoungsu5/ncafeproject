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

# ── 페이지 목록 상수 ──
PAGES = {
    "home": {"url": "/", "description": "홈페이지"},
    "menu_list": {"url": "/menus", "description": "메뉴 목록 페이지"},
    "login": {"url": "/login", "description": "로그인 페이지"},
    "cart": {"url": "/cart", "description": "장바구니 페이지"},
}

# ── Tool definitions (Gemini Function Declarations) ──
AGENT_TOOLS = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="navigate_to_page",
            description="고객의 브라우저를 특정 페이지로 이동시킵니다. '보여줘', '이동해줘', '가줘' 등 페이지 이동 요청에 사용합니다.",
            parameters_json_schema={
                "type": "object",
                "properties": {
                    "page": {
                        "type": "string",
                        "enum": list(PAGES.keys()),
                        "description": "이동할 페이지 (home: 홈페이지, menu_list: 메뉴 목록, login: 로그인, cart: 장바구니)",
                    },
                },
                "required": ["page"],
            },
        ),
    ]
)

# ── 시스템 프롬프트 ──
SYSTEM_PROMPT = """너는 불 타입 포켓몬 파이리가 운영하는 카페 NCafe의 점원이야.
문장 끝에는 꼭 "🔥" 또는 "파이리리" 같은 말투를 써줘.
따뜻하고 친근한 말투로 대답해줘.

도구 사용 규칙:
- "보여줘", "이동해줘", "가줘" 등 페이지를 보고 싶다는 요청 → navigate_to_page 사용
  - home: 홈페이지, menu_list: 메뉴 목록, login: 로그인, cart: 장바구니
- "추천해줘", "뭐가 있어?" 등 정보를 대화로 원할 때 → 텍스트로 답변
"""


def execute_function(name: str, args: dict):
    """
    function call 실행. (result, action) 튜플 반환.
    - result → Gemini에게 전달 (텍스트 응답 생성에 사용)
    - action → 프론트엔드로 전달 (브라우저 조작에 사용)
    """
    if name == "navigate_to_page":
        page_info = PAGES.get(args.get("page", ""))
        if not page_info:
            return {"error": "알 수 없는 페이지"}, None
        action = {"action": "navigate", "url": page_info["url"]}
        return {"success": True, "page": page_info["description"]}, action

    return {"error": f"알 수 없는 함수: {name}"}, None


def chat(messages: list[dict], context: str = "") -> dict:
    full_system_prompt = SYSTEM_PROMPT
    if context:
        full_system_prompt += f"\n\n{context}"

    config_params = types.GenerateContentConfig(
        system_instruction=full_system_prompt,
        tools=[AGENT_TOOLS],
    )

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


async def chat_stream(messages: list[dict], context: str = ""):
    """
    Function Calling 루프가 포함된 스트리밍.
    - 텍스트 청크 → str로 yield
    - 액션 → dict로 yield (텍스트 완료 후 마지막에)
    """
    full_system_prompt = SYSTEM_PROMPT
    if context:
        full_system_prompt += f"\n\n{context}"

    config_params = types.GenerateContentConfig(
        system_instruction=full_system_prompt,
        tools=[AGENT_TOOLS],
    )

    action = None  # 프론트엔드로 보낼 액션

    # 대화 내용을 Gemini contents 형식으로 변환
    contents = list(messages)

    max_loops = 5  # Function calling 무한 루프 방지
    for _ in range(max_loops):
        has_function_call = False

        response = await async_client.aio.models.generate_content_stream(
            model=MODEL_NAME,
            contents=contents,
            config=config_params
        )

        function_calls_in_response = []

        async for chunk in response:
            # 텍스트 청크 → 즉시 yield
            if chunk.text:
                yield chunk.text

            # function call 감지
            if chunk.candidates and chunk.candidates[0].content.parts:
                for part in chunk.candidates[0].content.parts:
                    if part.function_call:
                        has_function_call = True
                        fc_name = part.function_call.name
                        fc_args = part.function_call.args if isinstance(part.function_call.args, dict) else dict(part.function_call.args)
                        function_calls_in_response.append((fc_name, fc_args, part.function_call))

        # function call이 없으면 루프 종료
        if not has_function_call:
            break

        # function call 실행 및 결과를 Gemini에 전달
        for fc_name, fc_args, fc_obj in function_calls_in_response:
            result, fn_action = execute_function(fc_name, fc_args)
            if fn_action:
                action = fn_action

            # Gemini에 function call 결과를 전달하여 텍스트 응답 생성
            contents.append({
                "role": "model",
                "parts": [{"function_call": {"name": fc_name, "args": fc_args}}]
            })
            contents.append({
                "role": "user",
                "parts": [{"function_response": {"name": fc_name, "response": result}}]
            })

    # 텍스트 완료 후 마지막에 action을 dict로 yield
    if action:
        yield action
