import styles from './MenuDetailContent.module.css';

interface MenuDetailContentProps {
    korName: string;
    engName: string;
    price: number;
    categoryName: string;
    description: string;
}

export default function MenuDetailContent({
    korName,
    engName,
    price,
    categoryName,
    description,
}: MenuDetailContentProps) {
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
        </div>
    );
}
