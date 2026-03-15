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
        if (!id) return;

        const fetchMenu = async () => {
            setLoading(true);
            try {
                const encodedId = encodeURIComponent(id);
                console.log(`[useMenu] Fetching menu details for: ${id}`);
                
                const response = await fetch(`/api/menus/${encodedId}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`[useMenu] Successfully fetched menu:`, data.korName);
                    setMenu(data);
                } else {
                    console.error(`[useMenu] Fetch failed (${response.status}) for: ${id}`);
                    setMenu(null);
                }
            } catch (error) {
                console.error('[useMenu] Error fetching menu:', error);
                setMenu(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [id]);

    return { menu, loading };
}
