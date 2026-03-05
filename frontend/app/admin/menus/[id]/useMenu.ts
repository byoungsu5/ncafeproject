import { useState, useEffect } from 'react';

export interface MenuImageResponse {
    id: number;
    url: string;
    sortOrder: number;
    altText?: string;
}

export interface MenuDetailResponse {
    id: number;
    korName: string;
    engName: string;
    categoryName: string;
    price: string;
    isAvailable: boolean;
    createdAt: string;
    description: string;
    images: MenuImageResponse[];
}

export function useMenu(id: string) {
    const [menu, setMenu] = useState<MenuDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/admin/menus/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch menu');
                }
                const data = await response.json();
                setMenu(data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [id]);

    return { menu, loading, error };
}
