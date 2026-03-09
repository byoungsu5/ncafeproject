import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuCard.module.css';
import { MenuResponse } from '../MenuGrid/useMenus';
import { useCartStore } from '@/src/entities/cart/model/store';

interface MenuCardProps {
    menu: MenuResponse;
}

export default function MenuCard({ menu }: MenuCardProps) {
    const baseUrl = '/images';
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (!menu.isAvailable || menu.isSoldOut) return;

        addItem({
            id: menu.id,
            korName: menu.korName,
            engName: menu.engName,
            price: menu.price,
            imageSrc: menu.imageSrc,
        });
    };

    const disabled = !menu.isAvailable || menu.isSoldOut;

    return (
        <div className={styles.card}>
            <Link href={`/menus/${menu.id}`} className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                    {menu.imageSrc && menu.imageSrc !== 'blank.png' ? (
                        <Image
                            src={`${baseUrl}/${menu.imageSrc}`}
                            alt={menu.korName}
                            fill
                            className={styles.image}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className={styles.noImage}>No Image</div>
                    )}
                    <div className={styles.overlay} />
                    {menu.isSoldOut && (
                        <span className={styles.badgeSoldOut}>품절</span>
                    )}
                </div>

                <div className={styles.content}>
                    <span className={styles.category}>{menu.categoryName}</span>
                    <h3 className={styles.name}>{menu.korName}</h3>
                    <p className={styles.engName}>{menu.engName}</p>
                    <span className={styles.price}>{menu.price.toLocaleString()}원</span>
                </div>
            </Link>

            <button
                type="button"
                className={styles.addButton}
                onClick={handleAddToCart}
                disabled={disabled}
            >
                {disabled ? '담기 불가' : '장바구니 담기'}
            </button>
        </div>
    );
}

