import { useState, useEffect } from 'react';

export interface MenuImage {
    id: number;
    url: string;
    sortOrder: number;
    altText?: string;
}

export interface MenuImageListResponse {
    images: MenuImage[];
}

export function useMenuImages(menuId: string) {
    const [images, setImages] = useState<MenuImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!menuId) return;

        const fetchImages = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/admin/menus/${menuId}/menu-images`);

                if (!response.ok) {
                    throw new Error('Menu images fetch failed');
                }

                const data: MenuImageListResponse = await response.json();
                setImages(data.images);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [menuId]);

    return { images, loading, error };
}
