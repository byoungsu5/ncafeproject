import { useState, useEffect } from 'react';

export interface MenuDetailResponse {
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
    options?: {
        id: number;
        name: string;
        type: string;
        required: boolean;
        sortOrder: number;
        items: {
            id: number;
            name: string;
            priceDelta: number;
            sortOrder: number;
        }[];
    }[];
}

export function useMenu(id: string) {
    const [menu, setMenu] = useState<MenuDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            try {
                // If it's a number, it might be an ID, otherwise it's definitely a slug.
                // But we want to use slugs by default now.
                const response = await fetch(`/api/menus/slug/${id}`);
                if (!response.ok) {
                    // Fallback to ID if slug not found (for backward compatibility or if id is actually an ID)
                    const fallbackResponse = await fetch(`/api/menus/${id}`);
                    if (!fallbackResponse.ok) {
                        throw new Error('Failed to fetch menu');
                    }
                    const data = await fallbackResponse.json();
                    setMenu(data);
                    return;
                }
                const data = await response.json();
                setMenu(data);
            } catch (error) {
                console.error('Error fetching menu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [id]);

    return { menu, loading };
}
