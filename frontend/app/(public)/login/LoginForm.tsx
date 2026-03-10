// app/login/LoginForm.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function LoginForm() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            await login(formData);
        } catch (err: any) {
            setError(err.message || '로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <section className={styles.leftPanel}>
                    <div className={styles.leftCard}>
                        <div className={styles.leftImageWrapper}>
                            <Image
                                src="/images/charmander-barista2.png"
                                alt="따뜻한 커피를 들고 있는 파이리"
                                fill
                                sizes="(max-width: 1024px) 100vw, 420px"
                            />
                        </div>
                        <h2 className={styles.leftTitle}>잠시 쉬어가실래요?</h2>
                        <p className={styles.leftSubtitle}>파이리가 함께할게요!</p>
                    </div>
                </section>

                <section className={styles.rightPanel}>
                    <form onSubmit={handleSubmit} className={styles.loginCard}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>다시 만나서 반가워요!</h1>
                            <p className={styles.subtitle}>
                                파이리의 특별한 커피가 기다리고 있어요!
                            </p>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="username" className={styles.label}>
                                아이디
                            </label>
                            <input
                                id="username"
                                type="text"
                                className={styles.input}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="아이디를 입력하세요"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && <p className={styles.errorMessage}>⚠️ {error}</p>}

                        <button type="submit" className={styles.button} disabled={isLoading}>
                            {isLoading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}


