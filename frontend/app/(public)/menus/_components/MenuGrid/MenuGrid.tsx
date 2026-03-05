'use client';

import styles from './MenuGrid.module.css';
import MenuCard from '../MenuCard';
import { useMenus } from './useMenus';

interface MenuGridProps {
    selectedCategory: number | undefined;
    searchQuery: string;
}

export default function MenuGrid({ selectedCategory, searchQuery }: MenuGridProps) {
    const { menus, loading } = useMenus(
        selectedCategory,
        searchQuery || undefined,
    );

    if (loading) {
        return (
            <div className={styles.grid}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={styles.skeleton}>
                        <div className={styles.skeletonImage} />
                        <div className={styles.skeletonContent}>
                            <div className={styles.skeletonBadge} />
                            <div className={styles.skeletonTitle} />
                            <div className={styles.skeletonText} />
                            <div className={styles.skeletonPrice} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className={styles.empty}>
                <span className={styles.emptyIcon}>☕</span>
                <p className={styles.emptyTitle}>메뉴가 없습니다</p>
                <p className={styles.emptyText}>
                    {searchQuery
                        ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
                        : '등록된 메뉴가 없습니다.'}
                </p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {menus.map((menu) => (
                <MenuCard key={menu.id} menu={menu} />
            ))}
        </div>
    );
}
