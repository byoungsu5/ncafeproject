'use client';

import { CheckCircle2, ChevronRight, X, AlertCircle, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrderModal } from './useOrderModal';
import styles from './OrderModal.module.css';
import { useEffect, useState } from 'react';

export default function OrderModal() {
    const { isOpen, type, title, message, orderId, amount, onConfirm, onPaymentSuccess, close } = useOrderModal();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<'CARD' | 'TOSS' | 'KAKAO'>('CARD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !isOpen) return null;

    const handleConfirmAction = async () => {
        if (type === 'payment') {
            await handlePayment();
            return;
        }
        
        if (onConfirm) {
            onConfirm();
        }
        if (type !== 'confirm') {
            close();
        }
    };

    const handlePayment = async () => {
        if (!orderId || !amount || isProcessing) return;
        
        setIsProcessing(true);
        try {
            // KakaoPay needs initiation (ready) step
            if (selectedMethod === 'KAKAO') {
                console.log('[OrderModal] Initiating KakaoPay with OrderID:', orderId);
                const response = await fetch('/api/payments/initiate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId,
                        amount,
                        paymentMethod: selectedMethod,
                    }),
                });

                const data = await response.json();
                console.log('[OrderModal] Server response:', data);

                if (!response.ok) {
                    throw new Error(data.message || '카카오페이 초기화 중 오류가 발생했습니다.');
                }
                
                const { redirectUrl } = data;
                if (redirectUrl) {
                    setQrUrl(redirectUrl);
                    window.location.href = redirectUrl;
                    return;
                } else {
                    console.error('[OrderModal] Redirect URL is missing in response');
                    throw new Error('결제 준비 데이터를 받지 못했습니다. 서버 로그를 확인하세요.');
                }
            }

            // Others or Standard flow
            const response = await fetch('/api/payments/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    amount,
                    paymentMethod: selectedMethod,
                }),
            });

            if (!response.ok) throw new Error('결제 처리 중 오류가 발생했습니다.');

            const payment = await response.json();
            if (onPaymentSuccess) {
                onPaymentSuccess(payment);
            }
        } catch (error: any) {
            console.error('Payment failed:', error);
            // Optional: show error modal or message
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={close}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {type !== 'confirm' && type !== 'payment' && (
                    <button className={styles.closeBtn} onClick={close}>
                        <X size={20} />
                    </button>
                )}
                
                <div className={styles.content}>
                    <div className={`${styles.iconWrapper} ${styles[type]}`}>
                        {type === 'confirm' && <ChevronRight size={36} className={styles.icon} />}
                        {type === 'payment' && <CreditCard size={36} className={styles.icon} />}
                        {type === 'success' && <CheckCircle2 size={36} className={styles.icon} />}
                        {type === 'error' && <AlertCircle size={36} className={styles.icon} />}
                    </div>
                    
                    <div className={styles.textGroup}>
                        <h3 className={styles.title}>{title}</h3>
                        <p className={styles.description}>{message}</p>
                        
                        {type === 'payment' && amount && (
                           <>
                            <div className={styles.amountBox}>
                                <span className={styles.amountLabel}>결제 금액</span>
                                <span className={styles.amountValue}>{amount.toLocaleString()}원</span>
                            </div>
                            <div className={styles.paymentSelection}>
                                <div 
                                    className={`${styles.paymentMethod} ${selectedMethod === 'CARD' ? styles.paymentMethodSelected : ''}`}
                                    onClick={() => setSelectedMethod('CARD')}
                                >
                                    <div className={styles.methodIcon}>💳</div>
                                    <div className={styles.methodInfo}>
                                        <span className={styles.methodName}>신용/체크카드</span>
                                        <span className={styles.methodDesc}>일반 결제</span>
                                    </div>
                                </div>
                                <div 
                                    className={`${styles.paymentMethod} ${styles.toss} ${selectedMethod === 'TOSS' ? styles.paymentMethodSelected : ''}`}
                                    onClick={() => setSelectedMethod('TOSS')}
                                >
                                    <div className={styles.methodIcon}>🪙</div>
                                    <div className={styles.methodInfo}>
                                        <span className={styles.methodName}>토스페이</span>
                                        <span className={styles.methodDesc}>빠르고 간편한 결제</span>
                                    </div>
                                </div>
                                <div 
                                    className={`${styles.paymentMethod} ${styles.kakao} ${selectedMethod === 'KAKAO' ? styles.paymentMethodSelected : ''}`}
                                    onClick={() => { setSelectedMethod('KAKAO'); setQrUrl(null); }}
                                >
                                    <div className={styles.methodIcon}>🟡</div>
                                    <div className={styles.methodInfo}>
                                        <span className={styles.methodName}>카카오페이</span>
                                        <span className={styles.methodDesc}>국민 간편 결제</span>
                                    </div>
                                </div>
                            </div>

                           </>
                        )}

                        {orderId && type !== 'payment' && (
                            <div className={styles.orderIdBadge}>
                                주문번호: <span>{orderId}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        {type === 'confirm' || type === 'payment' ? (
                            <>
                                <button className={styles.cancelBtn} onClick={close}>
                                    취소
                                </button>
                                <button 
                                    className={styles.confirmBtn} 
                                    onClick={handleConfirmAction}
                                    disabled={isProcessing}
                                >
                                    {type === 'payment' ? (isProcessing ? '결제 중...' : '결제하기') : '주문하기'}
                                    <ChevronRight size={18} />
                                </button>
                            </>
                        ) : type === 'success' ? (
                            <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
                                <button className={styles.cancelBtn} onClick={close}>
                                    닫기
                                </button>
                                <button className={`${styles.confirmBtn} ${styles.success}`} onClick={() => { close(); router.push('/orders'); }}>
                                    주문현황 보기
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        ) : (
                            <button className={`${styles.fullBtn} ${styles[type]}`} onClick={close}>
                                확인
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
