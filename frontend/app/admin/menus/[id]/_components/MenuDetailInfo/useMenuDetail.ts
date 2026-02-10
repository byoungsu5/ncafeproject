import { useState, useEffect } from 'react';
import { MenuImage } from '@/types';

export interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    categoryName: string;
    price: number;
    isAvailable: boolean;
    createdAt: string;
    description: string;
}

export function useMenuDetail(id: number | string) {
    const [menu, setMenu] = useState<MenuDetail | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchMenu = async () => {
            try {
                const response = await fetch(`/api/v1/admin/menus/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch menu detail');
                }
                const data = await response.json();
                setMenu(data);
            } catch (error) {
                console.error("Error loading menu detail:", error);
            }
        };

        fetchMenu();
    }, [id]);

    return { menu };
}
