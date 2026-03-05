import { MenuCategory, Menu } from '@/types';
import styles from './CategoryTabs.module.css';
import { CategoryResponseDto, useCategories } from './useCategories';
import { useState } from 'react';

export default function CategoryTabs({ selectedCategory, setSelectedCategory }: { selectedCategory: number | undefined; setSelectedCategory: (id: number) => void }) {
    const { categories } = useCategories();
    // const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    return (
        <div className={styles.tabs}>
            {/* 전체 탭 */}
            <button
                className={`${styles.tab} ${selectedCategory === undefined ? styles.tabActive : ''}`}
                onClick={() => setSelectedCategory(undefined as any)}
            >
                <span className={styles.tabIcon}>📋</span>
                전체
                <span className={styles.tabCount}>{100}</span>
            </button>

            {/* 카테고리별 탭 */}
            {categories.map((category: CategoryResponseDto) => (
                <button
                    key={category.id}
                    className={`${styles.tab} ${selectedCategory === category.id ? styles.tabActive : ''}`}
                    onClick={() => {
                        setSelectedCategory(category.id);
                    }}
                >
                    <span className={styles.tabIcon}>{category.icon}</span>
                    {category.name}
                    <span className={styles.tabCount}>{0}</span>
                </button>
            ))}
        </div>
    );
}
