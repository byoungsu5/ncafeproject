'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

type Role = 'user' | 'model';

interface ChatMessage {
    id: string;
    role: Role;
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [nickname, setNickname] = useState('나');
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isSending) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: inputValue.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsSending(true);

        try {
            const payload = {
                messages: [
                    { role: 'user', content: `내 닉네임은 "${nickname}"이야.` },
                    ...messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    { role: userMessage.role, content: userMessage.content },
                ],
                stream: false,
            };

            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('AI chat error:', errorData.message || 'Unknown error');
                return;
            }

            const data: { content?: string } = await response.json();
            if (data.content) {
                const aiMessage: ChatMessage = {
                    id: crypto.randomUUID(),
                    role: 'model',
                    content: data.content,
                };
                setMessages((prev) => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error('Failed to send AI chat message:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={styles.chatContainer}>
            <h1 className={styles.chatTitle}>NCafe AI 채팅 (Gemini)</h1>

            <div className={styles.messageList} ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className={styles.loading}>
                        첫 메시지를 보내서 Gemini와 대화를 시작해보세요.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.messageItem} ${
                                msg.role === 'user' ? styles.own : ''
                            }`}
                        >
                            <span className={styles.senderName}>
                                {msg.role === 'user' ? nickname : 'Gemini'}
                            </span>
                            <div className={styles.messageBubble}>{msg.content}</div>
                        </div>
                    ))
                )}
            </div>

            <form className={styles.inputArea} onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="닉네임"
                    className={styles.inputField}
                    style={{ flex: 0.3 }}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    className={styles.inputField}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={!inputValue.trim() || isSending}
                >
                    {isSending ? '응답 생성 중...' : '전송'}
                </button>
            </form>
        </div>
    );
}

