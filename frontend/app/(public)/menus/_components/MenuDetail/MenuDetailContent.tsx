import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { useCartStore } from '@/src/entities/cart/model/store';
import styles from './MenuDetailContent.module.css';

interface MenuDetailContentProps {
    id: number;
    korName: string;
    engName: string;
    price: number;
    categoryName: string;
    description: string;
    imageSrc: string;
    isAvailable: boolean;
    isSoldOut: boolean;
}

export default function MenuDetailContent({
    id,
    korName,
    engName,
    price,
    categoryName,
    description,
    imageSrc,
    isAvailable,
    isSoldOut,
}: MenuDetailContentProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isOrdering, setIsOrdering] = useState(false);
    const router = useRouter();

    const handleAddToCart = () => {
        if (!isAvailable || isSoldOut) return;

        addItem({
            id,
            korName,
            engName,
            price,
            imageSrc,
        });
        alert(`${korName}이(가) 장바구니에 담겼습니다.`);
    };

    const handleOrderNow = async () => {
        if (!isAvailable || isSoldOut || isOrdering) return;

        if (!confirm(`${korName}을(를) 바로 주문하시겠어요?`)) return;

        setIsOrdering(true);
        try {
            const orderRequest = {
                items: [
                    {
                        menuId: id,
                        menuName: korName,
                        price: price,
                        quantity: 1,
                    },
                ],
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderRequest),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || '주문 중 오류가 발생했습니다.');
            }

            const order = await response.json();
            alert(`주문이 완료되었습니다! (주문번호: ${order.id})`);
            router.push('/');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsOrdering(false);
        }
    };

    const disabled = !isAvailable || isSoldOut;
    return (
        <div className={styles.content}>
            <span className={styles.category}>{categoryName}</span>
            <h1 className={styles.korName}>{korName}</h1>
            <p className={styles.engName}>{engName}</p>
            <p className={styles.price}>{price.toLocaleString()}원</p>

            {description && (
                <div className={styles.descriptionSection}>
                    <h2 className={styles.sectionTitle}>설명</h2>
                    <p className={styles.description}>{description}</p>
                </div>
            )}

            <div className={styles.actionButtons}>
                <button 
                    className={styles.cartBtn} 
                    onClick={handleAddToCart}
                    disabled={disabled || isOrdering}
                >
                    <ShoppingCart size={20} />
                    {disabled ? '품절' : '장바구니 담기'}
                </button>
                <button 
                    className={styles.orderBtn}
                    onClick={handleOrderNow}
                    disabled={disabled || isOrdering}
                >
                    <CreditCard size={20} />
                    {disabled ? '품절' : isOrdering ? '처리 중...' : '바로 주문하기'}
                </button>
            </div>
        </div>
    );
}
