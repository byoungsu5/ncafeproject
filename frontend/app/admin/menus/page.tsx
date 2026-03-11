'use client';


import { useState } from 'react';
import styles from './page.module.css';
import CategoryTabs from './_components/CategoryTabs';
import MenuList from './_components/MenuList';
import MenusPageHeader from './_components/MenusPageHeader';


export default function MenusPage() {
    // 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [totalCount, setTotalCount] = useState(0);
    const [soldOutCount, setSoldOutCount] = useState(0);

    return (
        <main className={styles.page}>
            {/* Background elements for premium feel */}
            <div className={styles.bgGlow1} />
            <div className={styles.bgGlow2} />
            <div className={styles.bgGrid} />

            <div className={styles.container}>
                {/* 페이지 헤더 */}
                <MenusPageHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    totalCount={totalCount}
                    soldOutCount={soldOutCount}
                />

                {/* 카테고리 탭 (추후 구현) */}
                <CategoryTabs
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                {/* 메뉴 그리드 */}
                <MenuList
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                    onDataFetch={(total, soldOut) => {
                        setTotalCount(total);
                        setSoldOutCount(soldOut);
                    }}
                />
            </div>
        </main>
    );
}
