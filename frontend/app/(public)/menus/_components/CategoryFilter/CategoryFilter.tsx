'use client';

import styles from './CategoryFilter.module.css';
import { CategoryResponse, useCategories } from './useCategories';

interface CategoryFilterProps {
    selectedCategory: number | undefined;
    onSelect: (categoryId: number | undefined) => void;
}

export default function CategoryFilter({ selectedCategory, onSelect }: CategoryFilterProps) {
    const { categories, loading } = useCategories();

    if (loading) {
        return (
            <div className={styles.tabs}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={styles.skeleton} />
                ))}
            </div>
        );
    }

    return (
        <div className={styles.tabs}>
            <button
                className={`${styles.tab} ${selectedCategory === undefined ? styles.tabActive : ''}`}
                onClick={() => onSelect(undefined)}
            >
                <span className={styles.tabIcon}>📋</span>
                전체
            </button>

            {categories.map((category: CategoryResponse) => (
                <button
                    key={category.id}
                    className={`${styles.tab} ${selectedCategory === category.id ? styles.tabActive : ''}`}
                    onClick={() => onSelect(category.id)}
                >
                    <span className={styles.tabIcon}>{category.icon}</span>
                    {category.name}
                </button>
            ))}
        </div>
    );
}
