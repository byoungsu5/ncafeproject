// app/(public)/signup/SignupForm.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../login/login.module.css';

export default function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || '회원가입 요청 중 오류가 발생했습니다.');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || '회원가입 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <section className={styles.leftPanel}>
                        <div className={styles.leftCard}>
                            <div className={styles.leftImageWrapper}>
                                <Image
                                    src="/images/charmander-barista3.png"
                                    alt="환영하는 파이리"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 420px"
                                />
                            </div>
                            <h2 className={styles.leftTitle}>가입을 환영해요!</h2>
                            <p className={styles.leftSubtitle}>파이리가 기다리고 있었어요!</p>
                        </div>
                    </section>
                    
                    <section className={styles.rightPanel}>
                        <div className={styles.loginCard}>
                            <div className={styles.header}>
                                <h1 className={styles.title}>가입 완료!</h1>
                                <p className={styles.subtitle}>파이리 카페의 멋진 회원이 되셨네요!</p>
                            </div>
                            <Link href="/login" className={styles.button} style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                                로그인하러 가기
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <section className={styles.leftPanel}>
                    <div className={styles.leftCard}>
                        <div className={styles.leftImageWrapper}>
                            <Image
                                src="/images/charmander-barista3.png"
                                alt="파이리의 커피 클래스 회원 안내"
                                fill
                                sizes="(max-width: 1024px) 100vw, 420px"
                            />
                        </div>
                        <h2 className={styles.leftTitle}>처음 오셨나요?</h2>
                        <p className={styles.leftSubtitle}>지금 가입하고 따뜻한 커피를 만나보세요!</p>
                    </div>
                </section>

                <section className={styles.rightPanel}>
                    <form onSubmit={handleSubmit} className={styles.loginCard}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>회원가입</h1>
                            <p className={styles.subtitle}>파이리의 단골 손님이 되어주세요!</p>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="username" className={styles.label}>아이디</label>
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
                            <label htmlFor="password" className={styles.label}>비밀번호</label>
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

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>비밀번호 확인</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="비밀번호를 다시 입력하세요"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && <p className={styles.errorMessage}>⚠️ {error}</p>}

                        <button type="submit" className={styles.button} disabled={isLoading}>
                            {isLoading ? '가입 준비 중...' : '회원가입 완료!'}
                        </button>

                        <div className={styles.formGroup} style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <p style={{ color: '#ea580c', fontSize: '0.9rem', marginBottom: '0.3rem' }}>이미 계정이 있으신가요?</p>
                            <Link href="/login" style={{ color: '#c2410c', fontWeight: 'bold', textDecoration: 'none' }}>
                                로그인하러 가기
                            </Link>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
