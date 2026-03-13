import { ListChecks } from 'lucide-react';
import styles from './MenuOptions.module.css';
import { useMenuDetail } from '../MenuDetailInfo/useMenuDetail';

export default function MenuOptions({ menuId }: { menuId: string }) {
    const { menuDetail, loading, error } = useMenuDetail(menuId);

    if (loading) return <div className={styles.loading}>옵션을 불러오는 중...</div>;
    if (error || !menuDetail) return <div className={styles.error}>옵션을 불러오지 못했습니다.</div>;

    // 디버깅을 위한 로그 추가
    console.log('[MenuOptions] menuDetail:', menuDetail);

    // 여러 필드명 시도 (options, optionGroups 등)
    const options = (menuDetail as any).options || (menuDetail as any).optionGroups || [];
    console.log('[MenuOptions] detected options:', options);

    if (!options || options.length === 0) {
        return (
            <section className={styles.card}>
                <h2 className={styles.sectionTitle}>
                    <ListChecks size={20} />
                    옵션
                </h2>
                <div className={styles.emptyState}>
                    등록된 옵션이 없습니다.<br/>
                    <small style={{ opacity: 0.5, fontSize: '0.9em' }}>
                        (카테고리: {menuDetail.categoryName || '미지정'})
                    </small>
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

            {options.map((option: any, index: number) => {
                // 백엔드 필드명(isRequired)과 프론트엔드 필드명(required) 모두 대응
                const isRequired = option.required ?? option.isRequired ?? false;
                const items = option.items || [];
                // 소문자/대문자 타입 모두 대응
                const typeLabel = (option.type || '').toLowerCase() === 'multiple' ? '다중 선택' : '단일 선택';

                return (
                    <div key={option.id || `group-${index}`} className={styles.optionGroup}>
                        <div className={styles.optionGroupHeader}>
                            <span>{option.name}</span>
                            <div className={styles.badges}>
                                <span className={styles.optionType}>
                                    {typeLabel}
                                </span>
                                {isRequired && (
                                    <span className={`${styles.optionBadge} ${styles.requiredBadge}`}>필수</span>
                                )}
                            </div>
                        </div>
 
                        <div className={styles.optionItems}>
                            {items.map((item: any, itemIndex: number) => (
                                <div key={item.id || `item-${itemIndex}`} className={styles.optionItem}>
                                    <span>{item.name}</span>
                                    <span className={styles.optionPrice}>
                                        {item.priceDelta > 0 ? `+${item.priceDelta.toLocaleString()}원` : '무료'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
 
            {/* Debug Section - Toggleable JSON */}
            <details style={{ marginTop: '20px', padding: '10px', border: '1px dashed #ccc', borderRadius: '4px' }}>
                <summary style={{ cursor: 'pointer', fontSize: '12px', color: '#666' }}>Debug: Raw API Response</summary>
                <pre style={{ fontSize: '11px', overflow: 'auto', maxHeight: '300px', backgroundColor: '#f9f9f9', padding: '10px' }}>
                    {JSON.stringify(menuDetail, null, 2)}
                </pre>
            </details>
        </section>
    );
}
