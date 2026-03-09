'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useCartStore } from '@/src/entities/cart/model/store';

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const increaseQuantity = useCartStore((state) => state.increaseQuantity);
    const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <main className={styles.page}>
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
                            disabled={items.length === 0}
                        >
                            주문하기
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}

