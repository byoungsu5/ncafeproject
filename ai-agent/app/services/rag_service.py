import psycopg2
from sentence_transformers import SentenceTransformer
import os
import sys

# Initialize model at module level
print("Loading SenetenceTransformer model...", file=sys.stderr)
model = SentenceTransformer("intfloat/multilingual-e5-small")
print("Model loaded.", file=sys.stderr)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "mydb")
DB_USER = os.getenv("DB_USER", "kang")
DB_PASSWORD = os.getenv("DB_PASSWORD", "1234")

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS rag_documents (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            embedding VECTOR(384),
            source_type VARCHAR(50) DEFAULT 'manual',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

def save_document(title: str, content: str, source_type: str = "manual"):
    embedding = model.encode(f"passage: {content}").tolist()
    conn = get_db_connection()
    cur = conn.cursor()
    query = """
        INSERT INTO rag_documents (title, content, embedding, source_type)
        VALUES (%s, %s, %s::vector, %s)
    """
    cur.execute(query, (title, content, embedding, source_type))
    conn.commit()
    cur.close()
    conn.close()
    return True

def get_documents():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, title, source_type, created_at FROM rag_documents ORDER BY created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    docs = []
    for row in rows:
        docs.append({
            "id": row[0],
            "title": row[1],
            "source_type": row[2],
            "created_at": row[3].isoformat() if row[3] else None
        })
    return docs

def delete_document(doc_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM rag_documents WHERE id = %s", (doc_id,))
    conn.commit()
    cur.close()
    conn.close()
    return True

def search_documents(query: str, limit: int = 3):
    # E5 model requires 'query: ' prefix for queries
    query_embedding = model.encode(f"query: {query}").tolist()
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Cosine distance (<=>) for similarity search
    search_query = """
        SELECT title, content, 1 - (embedding <=> %s::vector) AS similarity
        FROM rag_documents
        ORDER BY similarity DESC
        LIMIT %s
    """
    cur.execute(search_query, (query_embedding, limit))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    results = []
    for row in rows:
        results.append({
            "title": row[0],
            "content": row[1],
            "similarity": float(row[2])
        })
    return results
