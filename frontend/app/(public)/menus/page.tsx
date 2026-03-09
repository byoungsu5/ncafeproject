'use client';

import { useState, useCallback } from 'react';
import styles from './page.module.css';
import CategoryFilter from './_components/CategoryFilter';
import SearchBar from './_components/SearchBar';
import MenuGrid from './_components/MenuGrid';

export default function MenuPage() {
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    return (
        <main>
            {/* Hero Banner */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <span className={styles.heroLabel}>파이리의 뜨거운 메뉴</span>
                    <h1 className={styles.heroTitle}>
                        당신을 위해 준비한
                        <br />
                        <span className={styles.heroHighlight}>뜨끈뜨끈한 특급 메뉴</span>
                    </h1>
                    <p className={styles.heroDescription}>
                        파이리가 따뜻하게 준비한 메뉴를 만나보세요.
                        <br />
                        신선한 원두로 내린 커피부터 달콤한 디저트까지 준비되어 있습니다.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className={styles.content}>
                <div className={styles.toolbar}>
                    <CategoryFilter
                        selectedCategory={selectedCategory}
                        onSelect={setSelectedCategory}
                    />
                    <SearchBar onSearch={handleSearch} />
                </div>

                <MenuGrid
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                />
            </section>
        </main>
    );
}
