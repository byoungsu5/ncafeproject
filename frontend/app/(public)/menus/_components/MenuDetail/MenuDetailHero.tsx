import Image from 'next/image';
import styles from './MenuDetailHero.module.css';

interface MenuDetailHeroProps {
    imageSrc: string;
    korName: string;
    isSoldOut: boolean;
}

export default function MenuDetailHero({ imageSrc, korName, isSoldOut }: MenuDetailHeroProps) {
    const baseUrl = '/images';

    return (
        <div className={styles.hero}>
            {imageSrc && imageSrc !== 'blank.png' ? (
                <Image
                    src={`${baseUrl}/${imageSrc}`}
                    alt={korName}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            ) : (
                <div className={styles.noImage}>No Image</div>
            )}
            {isSoldOut && (
                <span className={styles.badgeSoldOut}>품절</span>
            )}
        </div>
    );
}
