import { useState, useEffect } from 'react';

// 백엔드 & 프론트엔드 통합 인터페이스
export interface MenuImage {
    id: number;
    menuId: number;
    url: string;
    sortOrder: number;
    altText?: string;
    createdAt?: string;
}

interface MenuImageListResponse {
    images: MenuImage[];
}

export function useMenuImages(menuId: string | number) {
    const [images, setImages] = useState<MenuImage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (!menuId) return;

        const fetchImages = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/admin/menus/${menuId}/menu-images`);
                if (!response.ok) {
                    throw new Error('Failed to fetch menu images');
                }
                const data: MenuImageListResponse = await response.json();

                // 데이터 처리: 정렬 등
                const processedImages = data.images.map(img => ({
                    ...img,
                    // 필요한 경우 url 경로 보정 등을 여기서 수행할 수 있음
                }));

                // 정렬 (sortOrder 기준 오름차순)
                processedImages.sort((a, b) => a.sortOrder - b.sortOrder);

                setImages(processedImages);
            } catch (err) {
                console.error("Error loading menu images:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [menuId]);

    return { images, loading, error, setImages };
}
