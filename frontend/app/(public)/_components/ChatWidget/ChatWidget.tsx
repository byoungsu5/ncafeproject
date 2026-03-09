'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ChatWidget.module.css';

type Role = 'bot' | 'user' | 'system';

interface WidgetMessage {
    id: string;
    role: Role;
    content: string;
}

const BOT_NAME = '꼬부기 대리점원';

function createId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<WidgetMessage[]>(() => [
        {
            id: createId(),
            role: 'bot',
            content:
                '꼬부꼬북! 🌊 시원한 물의 기운이 가득한 NCafe에 오신 걸 환영해북!\n어떤 음료를 추천해줄꼬북?',
        },
    ]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;

        const userContent = input.trim();
        setInput('');

        const userMsg: WidgetMessage = {
            id: createId(),
            role: 'user',
            content: userContent,
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsSending(true);

        try {
            const historyForModel = messages
                .filter((m) => m.role !== 'system')
                .map((m) => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    content: m.content,
                }));

            const payload = {
                messages: [
                    {
                        role: 'user',
                        content:
                            '너는 물 타입 포켓몬 꼬부기가 운영하는 카페 NCafe의 점원 컨셉으로 대답해야 해. ' +
                            '문장 끝에는 꼭 "꼬북" 또는 "꼬부꼬북" 같은 말투를 써줘.',
                    },
                    ...historyForModel,
                    { role: 'user', content: userContent },
                ],
                stream: false,
            };

            const res = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error('AI agent error');
            }

            const data = (await res.json()) as { content?: string };
            if (data.content) {
                const botMsg: WidgetMessage = {
                    id: createId(),
                    role: 'bot',
                    content: data.content,
                };
                setMessages((prev) => [...prev, botMsg]);
            }
        } catch (error) {
            const errorMsg: WidgetMessage = {
                id: createId(),
                role: 'system',
                content:
                    '꼬부꼬북… 🌊 지금은 바닷속 통신이 불안정해북! 잠시 후에 다시 불러줘꼬북!',
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={styles.container}>
            {isOpen && (
                <div className={styles.panel}>
                    <header className={styles.header}>
                        <div className={styles.avatar}>🐢</div>
                        <div className={styles.titleBlock}>
                            <div className={styles.title}>{BOT_NAME}</div>
                            <div className={styles.status}>
                                <span className={styles.statusDot} />
                                영업 중 · 언제든 물어보세요!
                            </div>
                        </div>
                    </header>
                    <p className={styles.subtitle}>
                        오늘의 추천 메뉴나 카페 관련 궁금한 점을 편하게 물어봐 주세요.
                    </p>
                    <div className={styles.messages} ref={scrollRef}>
                        {messages.map((msg) => {
                            const isUser = msg.role === 'user';
                            const isSystem = msg.role === 'system';
                            return (
                                <div
                                    key={msg.id}
                                    className={`${styles.bubbleRow} ${
                                        isUser ? styles.bubbleRowUser : ''
                                    }`}
                                >
                                    <div
                                        className={`${styles.bubble} ${
                                            isSystem
                                                ? styles.bubbleSystem
                                                : isUser
                                                ? styles.bubbleUser
                                                : styles.bubbleBot
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <form className={styles.footer} onSubmit={handleSubmit}>
                        <input
                            className={styles.input}
                            placeholder="메시지를 입력하세요..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            className={styles.sendButton}
                            disabled={!input.trim() || isSending}
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
                className={`${styles.toggleButton} ${isOpen ? styles.toggleClose : ''}`}
                onClick={handleToggle}
                aria-label={isOpen ? '채팅창 닫기' : '채팅창 열기'}
            >
                {isOpen ? '×' : '🐢'}
            </button>
        </div>
    );
}

