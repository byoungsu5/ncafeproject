import { useState, useEffect, useMemo } from 'react';
import { Menu } from '@/types';
import { useMenus } from './useMenus';
import MenuCard from '../MenuCard';
import Pagination from '@/app/_components/Pagination';
import styles from './MenuList.module.css';

const ITEMS_PER_PAGE = 12;

interface MenuListProps {
    selectedCategory: number | undefined;
    searchQuery: string | undefined;
}

export default function MenuList({ selectedCategory, searchQuery }: MenuListProps) {


    // http://localhost:8080/admin/menus?categoryId=1&searchQuery=coffee&page=0&size=10

    const { menus, setMenus } = useMenus(selectedCategory, searchQuery);

    const [currentPage, setCurrentPage] = useState(1);

    // 필터 변경 시 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    return (
        <div>
            <div className={styles.grid}>
                {menus.map((menu) => (
                    // <div key={menu.id}>{menu.korName}</div>
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
