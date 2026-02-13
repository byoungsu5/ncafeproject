'use client';

import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import styles from './MenusPageHeader.module.css';
import { useState } from 'react';

export default function MenusPageHeader({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void; }) {

    const [totalCount, setTotalCount] = useState(0);
    const [soldOutCount, setSoldOutCount] = useState(0);
    // const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className={styles.pageHeader}>
            <div className={styles.headerTop}>
                <div>
                    <h1 className={styles.title}>메뉴 관리</h1>
                    <p className={styles.subtitle}>카페의 모든 메뉴를 등록하고 관리합니다.</p>
                </div>
                <div className={styles.actions}>
                    <Link href="/admin/menus/new">
                        <Button icon={<Plus size={16} />}>
                            메뉴 등록
                        </Button>
                    </Link>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>전체 메뉴</span>
                    <span className={styles.statValue}>{totalCount}</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>판매 중</span>
                    <span className={styles.statValue}>{totalCount - soldOutCount}</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.statItem}>
                    <span className={`${styles.statLabel} ${styles.danger}`}>품절</span>
                    <span className={`${styles.statValue} ${styles.danger}`}>{soldOutCount}</span>
                </div>
            </div>

            <div className={styles.searchBar}>
                <div className={styles.searchInputWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="메뉴명 검색..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </header>
    );
}
