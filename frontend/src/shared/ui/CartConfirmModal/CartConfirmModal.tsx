'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowRight, X } from 'lucide-react';
import { useCartConfirmModal } from './useCartConfirmModal';
import styles from './CartConfirmModal.module.css';
import { useEffect, useState } from 'react';

export default function CartConfirmModal() {
    const { isOpen, itemName, close } = useCartConfirmModal();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !isOpen) return null;

    const handleGoToCart = () => {
        close();
        router.push('/cart');
    };

    return (
        <div className={styles.overlay} onClick={close}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={close}>
                    <X size={20} />
                </button>
                
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <ShoppingCart size={32} className={styles.icon} />
                    </div>
                    
                    <div className={styles.textGroup}>
                        <h3 className={styles.title}>장바구니 담기 완료! 🔥</h3>
                        <p className={styles.description}>
                            <span className={styles.itemName}>[{itemName}]</span> 이(가) 파이리의 따뜻한 장바구니에 담겼어요.
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.cancelBtn} onClick={close}>
                            계속 쇼핑하기
                        </button>
                        <button className={styles.confirmBtn} onClick={handleGoToCart}>
                            장바구니 이동
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
