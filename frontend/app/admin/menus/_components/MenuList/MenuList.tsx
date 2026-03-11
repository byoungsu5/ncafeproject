import { useState, useEffect } from 'react';
import { useMenus } from './useMenus';
import MenuCard from '../MenuCard';
import Pagination from '@/app/_components/Pagination';
import styles from './MenuList.module.css';

const ITEMS_PER_PAGE = 12;

interface MenuListProps {
    selectedCategory: number | undefined;
    searchQuery: string | undefined;
    onDataFetch?: (total: number, soldOut: number) => void;
}

export default function MenuList({ selectedCategory, searchQuery, onDataFetch }: MenuListProps) {

    const { menus, total } = useMenus(selectedCategory, searchQuery);

    const [currentPage, setCurrentPage] = useState(1);

    // 필터 변경 시 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    useEffect(() => {
        if (onDataFetch) {
            const soldOut = menus.filter(m => m.isSoldOut).length;
            onDataFetch(total, soldOut);
        }
    }, [menus, total, onDataFetch]);

    return (
        <div>
            <div className={styles.grid}>
                {menus.map((menu) => (
                    <MenuCard
                        key={menu.id}
                        menu={menu}
                    />
                ))}
            </div>

            {/* 페이징 컨트롤 */}
            <div className={styles.paginationWrapper}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={0}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
