import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuCard.module.css';
import { MenuResponse } from '../MenuGrid/useMenus';
import { useCartStore } from '@/src/entities/cart/model/store';

import { useCartConfirmModal } from '@/src/shared/ui/CartConfirmModal/useCartConfirmModal';

interface MenuCardProps {
    menu: MenuResponse;
}

export default function MenuCard({ menu }: MenuCardProps) {
    const baseUrl = '/images';
    const addItem = useCartStore((state) => state.addItem);
    const openModal = useCartConfirmModal((state) => state.open);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!menu.isAvailable || menu.isSoldOut) return;

        addItem({
            id: menu.id,
            korName: menu.korName,
            engName: menu.engName,
            price: menu.price,
            imageSrc: menu.imageSrc,
        });

        openModal(menu.korName);
    };

    const disabled = !menu.isAvailable || menu.isSoldOut;

    return (
        <div className={styles.card}>
            <Link href={`/menus/${menu.slug || menu.id}`} className={styles.cardLink}>
                <div className={styles.topCurve}></div>
                
                <div className={styles.imageContainer}>
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
                        {menu.isSoldOut && (
                            <span className={styles.badgeSoldOut}>품절</span>
                        )}
                    </div>
                </div>

                <div className={styles.content}>
                    <h3 className={styles.korName}>{menu.korName}</h3>
                    <p className={styles.engName}>{menu.engName || menu.categoryName}</p>
                    <p className={styles.description}>
                        {menu.description || `시원하고 깔끔한 파이리표 특제 ${menu.korName}입니다. 매력적인 맛을 즐겨보세요!`}
                    </p>
                </div>
            </Link>

            <button
                type="button"
                className={styles.priceButton}
                onClick={handleAddToCart}
                disabled={disabled}
            >
                {disabled ? '품절' : `${menu.price.toLocaleString()}원`}
            </button>
        </div>
    );
}
