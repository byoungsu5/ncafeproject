// app/(public)/signup/page.tsx
'use client';

import Link from 'next/link';
import styles from '../login/login.module.css';

export default function SignupPage() {
    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>몽글몽글 회원가입</h1>
                    <p className={styles.subtitle}>준비 중인 기능입니다! 잠시만 기다려주세요.</p>
                </div>

                <div className={styles.formGroup} style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ color: '#6d28d9', marginBottom: '1.5rem' }}>이미 계정이 있으신가요?</p>
                    <Link href="/login" className={styles.button}>
                        로그인하러 가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
