import { Flame, ChevronRight, Check } from 'lucide-react';
import styles from './MenuOptions.module.css';
import { useMenuDetail } from '../MenuDetailInfo/useMenuDetail';

export default function MenuOptions({ menuId }: { menuId: string }) {
    const { menuDetail, loading, error } = useMenuDetail(menuId);

    if (loading) return <div className={styles.loading}>옵션을 불러오는 중...</div>;
    if (error || !menuDetail) return <div className={styles.error}>옵션을 불러오지 못했습니다.</div>;

    const options = menuDetail.options || [];
    const hasOptions = Array.isArray(options) && options.length > 0;

    return (
        <section className={styles.card}>
            <h2 className={styles.sectionTitle}>
                <span className={styles.titleIconWrap}>
                    <Flame size={18} />
                </span>
                카페 옵션
                {hasOptions && <span className={styles.optionCountBadge}>{options.length}</span>}
            </h2>

            {!hasOptions ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Flame size={32} strokeWidth={1.5} />
                    </div>
                    <p className={styles.emptyTitle}>등록된 옵션이 없습니다</p>
                    <p className={styles.emptyDesc}>
                        옵션 관리 페이지에서 카테고리별 옵션을 추가해보세요.
                    </p>
                </div>
            ) : (
                <div className={styles.optionsList}>
                    {options.map((option: any, index: number) => {
                        const isRequired = option.required ?? option.isRequired ?? false;
                        const items = option.items || [];
                        const typeLabel = (option.type || '').toLowerCase() === 'multiple' ? '다중 선택' : '단일 선택';

                        return (
                            <div key={option.id || `group-${index}`} className={styles.optionGroup}>
                                <div className={styles.optionGroupHeader}>
                                    <div className={styles.headerLeft}>
                                        <span className={styles.groupName}>{option.name}</span>
                                    </div>
                                    <div className={styles.badges}>
                                        <span className={styles.typeBadge}>{typeLabel}</span>
                                        {isRequired && (
                                            <span className={styles.requiredBadge}>필수</span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.optionItems}>
                                    {items.map((item: any, itemIndex: number) => (
                                        <div key={item.id || `item-${itemIndex}`} className={styles.optionItem}>
                                            <div className={styles.itemLeft}>
                                                <span className={styles.itemDot} />
                                                <span className={styles.itemName}>{item.name}</span>
                                            </div>
                                            <span className={`${styles.optionPrice} ${
                                                typeof item.priceDelta === 'number' && item.priceDelta > 0
                                                    ? styles.pricePositive
                                                    : styles.priceFree
                                            }`}>
                                                {typeof item.priceDelta === 'number' && item.priceDelta > 0
                                                    ? `+${item.priceDelta.toLocaleString()}원`
                                                    : '무료'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
