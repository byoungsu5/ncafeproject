'use client';


import { useState } from 'react';
import CategoryTabs from './_components/CategoryTabs';
import MenuList from './_components/MenuList';
import MenusPageHeader from './_components/MenusPageHeader';


export default function MenusPage() {
    // 상태
    // Lifting State Up
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

    return (
        <main>
            {/* 페이지 헤더 */}
            <MenusPageHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* 카테고리 탭 */}
            {/* Callback Property */}
            <CategoryTabs
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            {/* 메뉴 그리드 (데이터 로딩 및 관리는 내부에서 수행) */}
            <MenuList
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
            />
        </main>
    );
}
