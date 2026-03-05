import { useState, useEffect } from 'react';

export interface MenuResponse {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    imageSrc: string;
    isAvailable: boolean;
    isSoldOut: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export function useMenus(selectedCategory: number | undefined, searchQuery: string | undefined) {
    const [menus, setMenus] = useState<MenuResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenus = async () => {
            setLoading(true);
            const url = new URL('/api/menus', window.location.origin);

            if (selectedCategory) {
                url.searchParams.set('categoryId', selectedCategory.toString());
            }
            if (searchQuery) {
                url.searchParams.set('query', searchQuery);
            }

            try {
                const response = await fetch(url.toString());
                if (!response.ok) {
                    throw new Error('Failed to fetch menus');
                }
                const data = await response.json();
                setMenus(data.menus);
            } catch (error) {
                console.error('Error fetching menus:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, [selectedCategory, searchQuery]);

    return { menus, loading };
}
