import { useState, useEffect } from 'react';
import { Menu } from '@/types';
import { mockCategories } from '@/mocks/menuData';


export interface MenuResponse {
    id: number,
    korName: string,
    engName: string,
    description: string,
    price: number,
    categoryName: string,
    imageSrc: string,
    isAvailable: boolean,
    isSoldOut: boolean,
    sortOrder: number,
    createdAt: string,
    updatedAt: string,
}

export interface MenuListResponse {
    menus: MenuResponse[],
    total: number,
}


export function useMenus(selectedCategory: number | undefined, searchQuery: string | undefined) {
    const [menus, setMenus] = useState<MenuResponse[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchMenus = async () => {

            const url = new URL(`/api/admin/menus`, window.location.origin);

            const params = url.searchParams;
            if (selectedCategory) {
                params.set('categoryId', selectedCategory.toString());
            }
            if (searchQuery) {
                params.set('query', searchQuery);
            }

            try {
                const response = await fetch(url.toString());
                if (!response.ok) {
                    throw new Error('Failed to fetch menus');
                }
                const data: MenuListResponse = await response.json();

                setMenus(data.menus);
                setTotal(data.total);
            } catch (error) {
                console.error('Error fetching menus:', error);
            }
        };

        fetchMenus();
    }, [selectedCategory, searchQuery]);

    return { menus, total, setMenus };
}
