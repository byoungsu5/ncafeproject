from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from app.services import rag_service

router = APIRouter(prefix="/api/ai/documents", tags=["RAG Documents"])

class DocumentCreate(BaseModel):
    title: str
    content: str

@router.post("")
def create_document(doc: DocumentCreate):
    try:
        rag_service.save_document(title=doc.title, content=doc.content, source_type="manual")
        return {"status": "success", "message": "도큐먼트가 저장되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_document(title: str = Form(...), file: UploadFile = File(...)):
    try:
        contents = await file.read()
        content_str = contents.decode("utf-8")
        rag_service.save_document(title=title, content=content_str, source_type="file")
        return {"status": "success", "message": "파일이 저장되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
def get_all_documents():
    try:
        docs = rag_service.get_documents()
        return docs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{doc_id}")
def delete_document(doc_id: int):
    try:
        rag_service.delete_document(doc_id)
        return {"status": "success", "message": "삭제되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
