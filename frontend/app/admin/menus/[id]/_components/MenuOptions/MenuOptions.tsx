import { ListChecks } from 'lucide-react';
import styles from './MenuOptions.module.css';
import { MenuOption } from '@/types';

import { useMenuDetail } from '../MenuDetailInfo/useMenuDetail';

export default function MenuOptions({ menuId }: { menuId: string }) {
    const { menuDetail, loading, error } = useMenuDetail(menuId);

    if (loading) return <div className={styles.loading}>옵션을 불러오는 중...</div>;
    if (error) return <div className={styles.error}>옵션을 불러오지 못했습니다.</div>;
    if (!menuDetail) return null;

    const options = menuDetail.options || [];

    if (!options || options.length === 0) {
        return (
            <section className={styles.card}>
                <h2 className={styles.sectionTitle}>
                    <ListChecks size={20} />
                    옵션
                </h2>
                <div className={styles.emptyState}>
                    등록된 옵션이 없습니다.
                </div>
            </section>
        );
    }

    return (
        <section className={styles.card}>
            <h2 className={styles.sectionTitle}>
                <ListChecks size={20} />
                옵션 ({options.length})
            </h2>

            {options.map((option: any) => (
                <div key={option.id} className={styles.optionGroup}>
                    <div className={styles.optionGroupHeader}>
                        <span>{option.name}</span>
                        <div className={styles.badges}>
                            <span className={styles.optionType}>
                                {option.type === 'single' ? '단일 선택' : '다중 선택'}
                            </span>
                            {option.required && (
                                <span className={`${styles.optionBadge} ${styles.requiredBadge}`}>필수</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.optionItems}>
                        {option.items.map((item: any) => (
                            <div key={item.id} className={styles.optionItem}>
                                <span>{item.name}</span>
                                <span className={styles.optionPrice}>
                                    {item.priceDelta > 0 ? `+${item.priceDelta.toLocaleString()}원` : '무료'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}
