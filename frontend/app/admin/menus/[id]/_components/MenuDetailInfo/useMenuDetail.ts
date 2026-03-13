import { useState, useEffect } from 'react';

export interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    slug: string;
    categoryName: string;
    categoryId: number;
    price: number | string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    description: string;
    images: any[];
    options: import('@/types').MenuOption[];
}

export function useMenuDetail(id: number | string) {
    const [menuDetail, setMenuDetail] = useState<MenuDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchMenu = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/admin/menus/${id}`, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error('Failed to fetch menu detail');
                }
                const data = await response.json();
                setMenuDetail(data);
            } catch (err) {
                console.error("Error loading menu detail:", err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [id]);

    return { menuDetail, loading, error };
}
