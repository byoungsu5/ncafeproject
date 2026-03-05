import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuCard.module.css';
import { MenuResponse } from '../MenuGrid/useMenus';

interface MenuCardProps {
    menu: MenuResponse;
}

export default function MenuCard({ menu }: MenuCardProps) {
    const baseUrl = '/images';

    return (
        <Link href={`/menus/${menu.id}`} className={styles.card}>
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
    );
}
