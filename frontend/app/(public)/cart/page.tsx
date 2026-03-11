'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useCartStore } from '@/src/entities/cart/model/store';

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const increaseQuantity = useCartStore((state) => state.increaseQuantity);
    const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const clearCart = useCartStore((state) => state.clear);
    const [isOrdering, setIsOrdering] = useState(false);
    const router = useRouter();

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleOrder = async () => {
        if (items.length === 0 || isOrdering) return;

        if (!confirm('정말로 주문하시겠어요?')) return;

        setIsOrdering(true);
        try {
            const orderRequest = {
                items: items.map((item) => ({
                    menuId: item.id,
                    menuName: item.korName,
                    price: item.price,
                    quantity: item.quantity,
                })),
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
            clearCart();
            router.push('/');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsOrdering(false);
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.bgGlow1} />
            <div className={styles.bgGlow2} />
            <div className={styles.bgGrid} />

            <div className={styles.cartWrapper}>
                <h1 className={styles.title}>장바구니</h1>
                <p className={styles.subtitle}>담아둔 메뉴를 한 번에 확인하고 주문할 수 있어요.</p>

                {items.length === 0 ? (
                    <div className={styles.empty}>장바구니가 비어 있어요. 메뉴를 먼저 담아주세요.</div>
                ) : (
                    <>
                        <ul className={styles.list}>
                            {items.map((item) => (
                                <li key={item.id} className={styles.item}>
                                    <div className={styles.imageWrapper}>
                                        {item.imageSrc ? (
                                            <Image
                                                src={`/images/${item.imageSrc}`}
                                                alt={item.korName}
                                                fill
                                                sizes="80px"
                                            />
                                        ) : null}
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.name}>{item.korName}</div>
                                        <div className={styles.engName}>{item.engName}</div>
                                        <div className={styles.price}>
                                            {(item.price * item.quantity).toLocaleString()}원
                                        </div>
                                    </div>
                                    <div className={styles.controls}>
                                        <div className={styles.quantityControls}>
                                            <button
                                                type="button"
                                                className={styles.quantityButton}
                                                onClick={() => decreaseQuantity(item.id)}
                                            >
                                                -
                                            </button>
                                            <span className={styles.quantityValue}>{item.quantity}</span>
                                            <button
                                                type="button"
                                                className={styles.quantityButton}
                                                onClick={() => increaseQuantity(item.id)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.removeButton}
                                            onClick={() => removeItem(item.id)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className={styles.summary}>
                            <div className={styles.summaryText}>
                                총 <span className={styles.summaryHighlight}>{totalCount}</span>개 /{' '}
                                <span className={styles.summaryHighlight}>
                                    {totalPrice.toLocaleString()}원
                                </span>
                            </div>
                            <button
                                type="button"
                                className={styles.orderButton}
                                disabled={items.length === 0 || isOrdering}
                                onClick={handleOrder}
                            >
                                {isOrdering ? '처리 중...' : '주문하기'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

