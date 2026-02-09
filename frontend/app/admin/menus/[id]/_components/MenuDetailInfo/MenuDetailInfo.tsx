import { Menu } from '@/types';
import { Info } from 'lucide-react';
import styles from './MenuDetailInfo.module.css';
import { format } from 'date-fns';
import { useMenuDetail } from './useMenuDetail';

export default function MenuDetailInfo({ id }: { id: number }) {

    const { menu } = useMenuDetail(id);

    return (
        <section className={styles.card}>
            <h2 className={styles.sectionTitle}>
                <Info size={20} />
                기본 정보
            </h2>

            <div className={styles.row}>
                <span className={styles.label}>한글명</span>
                <span className={styles.value}>{menu?.korName}</span>
            </div>

            <div className={styles.row}>
                <span className={styles.label}>영문명</span>
                <span className={styles.value}>{menu?.engName}</span>
            </div>

            <div className={styles.row}>
                <span className={styles.label}>카테고리</span>
                <span className={styles.value}>
                    {menu?.categoryName}
                </span>
            </div>

            <div className={styles.row}>
                <span className={styles.label}>가격</span>
                <span className={styles.value}>{menu?.price?.toLocaleString()}원</span>
            </div>

            <div className={styles.row}>
                <span className={styles.label}>판매 상태</span>
                <span className={`${styles.badge} ${menu?.isAvailable ? styles.badgeAvailable : styles.badgeSoldOut}`}>
                    {menu?.isAvailable ? '판매중' : '품절'}
                </span>
            </div>

            <div className={styles.row}>
                <span className={styles.label}>등록일</span>
                <span className={styles.value}>{menu?.createdAt ? format(new Date(menu.createdAt), 'yyyy-MM-dd') : ''}</span>
            </div>

            <div className={styles.descriptionWrapper}>
                <span className={styles.descriptionLabel}>설명</span>
                <p className={styles.description}>{menu?.description}</p>
            </div>
        </section>
    );
}
