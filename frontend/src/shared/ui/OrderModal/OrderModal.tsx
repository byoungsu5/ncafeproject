'use client';

import { CheckCircle2, ChevronRight, X, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrderModal } from './useOrderModal';
import styles from './OrderModal.module.css';
import { useEffect, useState } from 'react';

export default function OrderModal() {
    const { isOpen, type, title, message, orderId, onConfirm, close } = useOrderModal();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !isOpen) return null;

    const handleConfirmAction = () => {
        if (onConfirm) {
            onConfirm();
        }
        if (type !== 'confirm') {
            close();
        }
    };

    return (
        <div className={styles.overlay} onClick={close}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {type !== 'confirm' && (
                    <button className={styles.closeBtn} onClick={close}>
                        <X size={20} />
                    </button>
                )}
                
                <div className={styles.content}>
                    <div className={`${styles.iconWrapper} ${styles[type]}`}>
                        {type === 'confirm' && <ChevronRight size={36} className={styles.icon} />}
                        {type === 'success' && <CheckCircle2 size={36} className={styles.icon} />}
                        {type === 'error' && <AlertCircle size={36} className={styles.icon} />}
                    </div>
                    
                    <div className={styles.textGroup}>
                        <h3 className={styles.title}>{title}</h3>
                        <p className={styles.description}>{message}</p>
                        {orderId && (
                            <div className={styles.orderIdBadge}>
                                주문번호: <span>{orderId}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        {type === 'confirm' ? (
                            <>
                                <button className={styles.cancelBtn} onClick={close}>
                                    취소
                                </button>
                                <button className={styles.confirmBtn} onClick={handleConfirmAction}>
                                    주문하기
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
