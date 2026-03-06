'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [nickname, setNickname] = useState('익명');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch messages
    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/chat');
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 3 seconds for basic "live" feel
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const currentMsg = inputValue;
        setInputValue(''); // Clear input immediately for better UX

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender: nickname,
                    content: currentMsg,
                }),
            });

            if (response.ok) {
                fetchMessages(); // Refresh list
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className={styles.chatContainer}>
            <h1 className={styles.chatTitle}>NCafe 몽글 채팅 (메모리 버전)</h1>

            <div className={styles.messageList} ref={scrollRef}>
                {loading ? (
                    <div className={styles.loading}>채팅을 불러오는 중...</div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.messageItem} ${msg.sender === nickname ? styles.own : ''}`}
                        >
                            <span className={styles.senderName}>{msg.sender}</span>
                            <div className={styles.messageBubble}>{msg.content}</div>
                            <span className={styles.timestamp}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
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
                    disabled={!inputValue.trim()}
                >
                    전송
                </button>
            </form>
        </div>
    );
}
