'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/src/entities/cart/model/store';
import { sendMessageStream } from '@/app/lib/aiAgent';
import styles from './ChatWidget.module.css';

type Role = 'bot' | 'user' | 'system';

interface WidgetMessage {
    id: string;
    role: Role;
    content: string;
}

const BOT_NAME = '파이리 대리점원';

function createId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
}

export default function ChatWidget() {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<WidgetMessage[]>(() => [
        {
            id: createId(),
            role: 'bot',
            content:
                '파이리! 🔥 뜨거운 불의 기운이 가득한 파이리 카페에 오신 걸 환영해🔥!\n어떤 음료를 추천해줄까🔥?',
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

        const aiMessageId = createId();
        
        try {
            const historyForModel = messages
                .filter((m) => m.role !== 'system')
                .map((m) => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    content: m.content,
                }));

            const fullHistory = [
                {
                    role: 'user',
                    content:
                        '너는 불 타입 포켓몬 파이리가 운영하는 카페 NCafe의 점원 컨셉으로 대답해야 해. ' +
                        '문장 끝에는 꼭 "🔥" 또는 "파이리리" 같은 말투를 써줘. ' +
                        '사용자가 메뉴를 장바구니에 담아달라고 하면 add_to_cart 도구를 사용하고, ' +
                        '페이지 이동을 원하면 navigate_to 도구를 사용해. 도구를 사용할 때는 "메뉴 페이지로 이동할게요🔥!" 처럼 이동한다는 안내 메시지를 함께 말해줘. ' +
                        '이동 가능한 경로는 "/", "/menus", "/cart", "/login" 등이 있어.',
                },
                ...historyForModel,
                { role: 'user', content: userContent },
            ];

            // 빈 AI 메시지 추가
            setMessages((prev) => [
                ...prev,
                { id: aiMessageId, role: 'bot', content: '' },
            ]);

            // 스트리밍 루프
            for await (const chunk of sendMessageStream(fullHistory)) {
                if (typeof chunk === 'string') {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === aiMessageId
                                ? { ...msg, content: msg.content + chunk }
                                : msg
                        )
                    );
                } else if (chunk && typeof chunk === 'object' && 'action' in chunk) {
                    const actionObj = (chunk as any).action;
                    if (actionObj && actionObj.action === 'navigate') {
                        setTimeout(() => {
                            router.push(actionObj.url);
                        }, 500);
                    }
                }
            }

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === aiMessageId
                        ? {
                            ...msg,
                            role: 'system',
                            content: `파이리리… 🔥 지금은 불의 기운이 불안정해🔥! (${message}) 잠시 후에 다시 불러줘🔥!`,
                        }
                        : msg
                )
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={styles.container}>
            {isOpen && (
                <div className={styles.panel}>
                    <header className={styles.header}>
                        <div className={styles.avatar}>🔥</div>
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
                                    className={`${styles.bubbleRow} ${isUser ? styles.bubbleRowUser : ''
                                        }`}
                                >
                                    <div
                                        className={`${styles.bubble} ${isSystem
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
                        {isSending && (
                            <div className={styles.bubbleRow}>
                                <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.loadingBubble}`}>
                                    <div className={styles.dot}></div>
                                    <div className={styles.dot}></div>
                                    <div className={styles.dot}></div>
                                    <span className={styles.loadingText}>답변 대기 중...</span>
                                </div>
                            </div>
                        )}
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
                {isOpen ? '×' : '🔥'}
            </button>
        </div>
    );
}
