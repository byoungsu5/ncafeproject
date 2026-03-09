from google import genai
from typing import Generator
from app import config

client = genai.Client(api_key=config.GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash"

def chat(messages: list[dict]) -> str:
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=messages
    )
    return response.text

def chat_stream(messages: list[dict]) -> Generator[str, None, None]:
    response = client.models.generate_content_stream(
        model=MODEL_NAME,
        contents=messages
    )
    for chunk in response:
        if chunk.text:
            yield chunk.text
