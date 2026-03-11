import { MenuCategory, Menu } from '@/types';
import styles from './CategoryTabs.module.css';
import { CategoryResponseDto, useCategories } from './useCategories';
import { useState } from 'react';

const categoryIconMap: { [key: string]: string } = {
    '커피': '☕',
    '음료': '🥤',
    '베이커리': '🥐',
    '샌드위치': '🥪',
    '디저트': '🍰'
};

export default function CategoryTabs({ selectedCategory, setSelectedCategory }: { selectedCategory: number | undefined; setSelectedCategory: (id: number | undefined) => void }) {
    const { categories } = useCategories();

    return (
        <div className={styles.tabs}>
            {/* 전체 탭 */}
            <button
                className={`${styles.tab} ${selectedCategory === undefined ? styles.tabActive : ''}`}
                onClick={() => setSelectedCategory(undefined)}
            >
                <span className={styles.tabIcon}>📋</span>
                전체
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
                    <span className={styles.tabIcon}>{categoryIconMap[category.name] || '🏷️'}</span>
                    {category.name}
                </button>
            ))}
        </div>
    );
}
