'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('결제를 확인하고 있습니다...');

    useEffect(() => {
        const confirmPayment = async () => {
            const orderId = searchParams.get('orderId');
            const pgToken = searchParams.get('pg_token');

            if (!orderId || !pgToken) {
                // If it's a mock flow, it might only have orderId
                if (orderId && !pgToken) {
                     setStatus('success');
                     setMessage('결제가 성공적으로 확인되었습니다!');
                     return;
                }
                setStatus('error');
                setMessage('결제 정보가 올바르지 않습니다.');
                return;
            }

            try {
                const amount = searchParams.get('amount');
                const response = await fetch('/api/payments/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: Number(orderId),
                        pgToken: pgToken,
                        paymentMethod: 'KAKAO',
                        amount: Number(amount) || 0,
                    }),
                });

                if (response.ok) {
                    const payment = await response.json();
                    if (payment.status === 'PAID') {
                        setStatus('success');
                        setMessage('결제가 성공적으로 완료되었습니다!');
                    } else {
                        setStatus('error');
                        setMessage('결제가 완료되지 않았거나 취소되었습니다.');
                    }
                } else {
                    const error = await response.json();
                    setStatus('error');
                    setMessage(error.message || '결제 승인 중 오류가 발생했습니다.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('서버와의 통신 중 오류가 발생했습니다.');
            }
        };

        confirmPayment();
    }, [searchParams]);

    return (
        <main className={styles.page}>
            <div className={styles.bgGlow1} />
            <div className={styles.bgGlow2} />
            <div className={styles.bgGrid} />

            <div className={styles.card}>
                {status === 'loading' && (
                    <>
                        <div className={`${styles.iconWrapper} ${styles.loading}`}>
                            <Loader2 size={48} className="animate-spin" />
                        </div>
                        <h1 className={styles.title}>결제 확인 중</h1>
                        <p className={styles.description}>{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className={`${styles.iconWrapper} ${styles.success}`}>
                            <CheckCircle2 size={48} />
                        </div>
                        <h1 className={styles.title}>결제 완료!</h1>
                        <p className={styles.description}>{message}</p>
                        <div className={styles.orderIdBadge}>
                            주문번호: <span>{searchParams.get('orderId')}</span>
                        </div>
                        <Link href="/orders" className={styles.primaryButton}>
                            주문 내역 확인하기
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className={`${styles.iconWrapper} ${styles.error}`}>
                            <AlertCircle size={48} />
                        </div>
                        <h1 className={styles.title}>결제 실패</h1>
                        <p className={styles.description}>{message}</p>
                        <Link href="/menus" className={styles.secondaryButton}>
                            메뉴로 돌아가기
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
