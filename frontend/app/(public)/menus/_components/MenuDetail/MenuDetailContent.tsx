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
                    disabled={disabled}
                >
                    <ShoppingCart size={20} />
                    {disabled ? '품절' : '장바구니 담기'}
                </button>
                <button 
                    className={styles.orderBtn}
                    onClick={() => {
                        handleAddToCart();
                        // You can add logic to navigate to cart/checkout page here in the future
                    }}
                    disabled={disabled}
                >
                    <CreditCard size={20} />
                    {disabled ? '품절' : '바로 주문하기'}
                </button>
            </div>
        </div>
    );
}
