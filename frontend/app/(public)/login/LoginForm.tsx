// app/login/LoginForm.tsx
'use client';

import { useState } from 'react';
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
            <form onSubmit={handleSubmit} className={styles.loginCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>몽글몽글 로그인</h1>
                    <p className={styles.subtitle}>NCafe x 메타몽의 세계로 오신 것을 환영합니다!</p>
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

                {error && <p className={styles.errorMessage}>⚠️ {error}</p>}

                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? '변신 중...' : '로그인 실현!'}
                </button>
            </form>
        </div>
    );
}

