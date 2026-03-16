'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

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
                     setMessage('결제가 완료되었습니다!');
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
                        paymentMethod: 'KAKAO', // Assumed for this redirect
                        amount: Number(amount) || 0,
                    }),
                });

                if (response.ok) {
                    setStatus('success');
                    setMessage('결제가 성공적으로 완료되었습니다!');
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
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            padding: '1rem'
        }}>
            <div style={{ 
                maxWidth: '400px', 
                width: '100%', 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '1rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                {status === 'loading' && (
                    <>
                        <Loader2 size={64} color="#f97316" className="animate-spin" style={{ margin: '0 auto 1.5rem' }} />
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>결제 확인 중</h1>
                        <p style={{ color: '#6b7280' }}>{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle2 size={64} color="#22c55e" style={{ margin: '0 auto 1.5rem' }} />
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>결제 완료!</h1>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{message}</p>
                        <div style={{ 
                            backgroundColor: '#fff7ed', 
                            color: '#f97316',
                            padding: '0.5rem 1rem',
                            borderRadius: '2rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            display: 'inline-block',
                            marginBottom: '2rem'
                        }}>
                            주문번호: <span style={{ fontWeight: 800 }}>{searchParams.get('orderId')}</span>
                        </div>
                        <Link 
                            href="/orders"
                            style={{ 
                                display: 'block',
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: '#f97316',
                                color: 'white',
                                borderRadius: '0.5rem',
                                textDecoration: 'none',
                                fontWeight: 600
                            }}
                        >
                            주문 내역 확인하기
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <AlertCircle size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>결제 실패</h1>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{message}</p>
                        <Link 
                            href="/menus"
                            style={{ 
                                display: 'block',
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: '#1f2937',
                                color: 'white',
                                borderRadius: '0.5rem',
                                textDecoration: 'none',
                                fontWeight: 600
                            }}
                        >
                            메뉴로 돌아가기
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
