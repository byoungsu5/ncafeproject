'use client';

import { useState, useEffect, useRef } from 'react';
import { Trash2, UploadCloud, Send } from 'lucide-react';
import styles from './page.module.css';

interface RagDocument {
    id: number;
    title: string;
    source_type: string;
    created_at: string;
}

// Assumes the AI server runs on localhost:8136 locally (mapped from 8000 in Docker)
const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8136/api/ai';

export default function RagAdminPage() {
    const [documents, setDocuments] = useState<RagDocument[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Manual Input State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${AI_API_URL}/documents`);
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Failed to fetch documents', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await fetch(`${AI_API_URL}/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            if (res.ok) {
                setTitle('');
                setContent('');
                alert('문서가 저장되었습니다.');
                fetchDocuments();
            } else {
                alert('저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('저장 중 서버 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Ensure it's a text file
        if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
            alert('텍스트(.txt) 또는 마크다운(.md) 파일만 업로드 가능합니다.');
            return;
        }

        const formData = new FormData();
        formData.append('title', file.name);
        formData.append('file', file);

        try {
            setIsSubmitting(true);
            const res = await fetch(`${AI_API_URL}/documents/upload`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                alert('파일이 성공적으로 업로드되었습니다.');
                fetchDocuments();
            } else {
                alert('업로드 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('서버 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말로 이 문서를 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`${AI_API_URL}/documents/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchDocuments();
            } else {
                alert('삭제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>RAG 관리자 페이지</h1>
                <p className={styles.subtitle}>AI가 참조할 RAG(검색 증강 생성)용 텍스트 문서를 추가하거나 직접 작성하여 임베딩 및 저장합니다.</p>
            </div>

            <div className={styles.contentWrapper}>
                {/* Left Panel: Document List & Upload */}
                <div className={styles.leftPanel}>
                    <h2 className={styles.panelTitle}>저장된 지식 문서</h2>
                    
                    <div className={styles.docList}>
                        {loading ? (
                            <div className={styles.emptyState}>문서 목록을 불러오는 중...</div>
                        ) : documents.length === 0 ? (
                            <div className={styles.emptyState}>저장된 결과가 없습니다. 우측 또는 하단을 통해 추가해주세요.</div>
                        ) : (
                            documents.map((doc) => (
                                <div key={doc.id} className={styles.docItem}>
                                    <div>
                                        <div className={styles.docTitle}>{doc.title}</div>
                                        <div className={styles.docMeta}>
                                            <span className={styles.docType}>{doc.source_type}</span>
                                            <span>
                                                {new Date(doc.created_at).toLocaleDateString('ko-KR', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(doc.id)}
                                        title="문서 삭제"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div 
                        className={styles.uploadArea} 
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadCloud size={32} className={styles.uploadIcon} />
                        <div className={styles.uploadText}>.txt 또는 .md 문서 파일을 클릭하여 업로드 하세요</div>
                        <button className={styles.uploadBtn}>파일 선택</button>
                        <input 
                            type="file" 
                            accept=".txt,.md" 
                            className={styles.fileInput} 
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>

                {/* Right Panel: Manual Input */}
                <div className={styles.rightPanel}>
                    <h2 className={styles.panelTitle}>직접 작성하기</h2>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>제목 (Title)</label>
                        <input 
                            type="text" 
                            className={styles.input} 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="문서의 성격을 잘 나타내는 제목 (예: 카페 메뉴 레시피 정보)"
                        />
                    </div>
                    
                    <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <label className={styles.label}>내용 (Content)</label>
                        <textarea 
                            className={styles.textarea} 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="AI가 읽고 참고할 수 있는 본문 내용을 자세하게 입력하세요. 마크다운도 지원됩니다."
                        />
                    </div>
                    
                    <div className={styles.submitWrapper}>
                        <button 
                            className={`${styles.submitBtn} ${styles.submitBtnTheme}`}
                            onClick={handleManualSubmit}
                            disabled={isSubmitting || !title.trim() || !content.trim()}
                        >
                            <Send size={16} />
                            {isSubmitting ? '임베딩 처리 및 저장 중...' : '임베딩 후 벡터 DB에 저장'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
