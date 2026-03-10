from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, rag
from app.services import rag_service
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB table for RAG on startup
    try:
        rag_service.init_db()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Failed to initialize database: {e}")
    yield

app = FastAPI(title="AI Chat Server", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(rag.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
