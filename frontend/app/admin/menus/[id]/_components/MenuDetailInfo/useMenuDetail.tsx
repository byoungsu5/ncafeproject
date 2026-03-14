import { useState, useEffect } from 'react';

/**
 * 메뉴 상세 정보 데이터 구조 정의
 */
export interface OptionItemDetail {
    id?: number;
    name: string;
    priceDelta: number;
    sortOrder: number;
}

export interface MenuOptionDetail {
    id?: number;
    name: string;
    type: string;
    isRequired?: boolean;
    required?: boolean;
    sortOrder: number;
    items: OptionItemDetail[];
}

export interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    categoryId: number;
    categoryName: string;
    price: number;
    isAvailable: boolean;
    isSoldOut: boolean;
    createdAt: string;
    description: string;
    options: MenuOptionDetail[];
}

/**
 * 특정 메뉴의 상세 정보를 가져오는 커스텀 후크
 * @param id 메뉴 ID
 */
export function useMenuDetail(id: string) {
    const [menuDetail, setMenuDetail] = useState<MenuDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchMenuDetail = async () => {
            try {
                setLoading(true);
                // 백엔드 API 호출
                const response = await fetch(`/api/admin/menus/${id}`);

                if (!response.ok) {
                    throw new Error('메뉴 정보를 가져오는 데 실패했습니다.');
                }

                const data = await response.json();

                // 데이터 구조에 맞게 매핑 (options 포함)
                const mappedData: MenuDetail = {
                    id: data.id,
                    korName: data.korName,
                    engName: data.engName,
                    categoryId: data.categoryId,
                    categoryName: data.categoryName,
                    price: typeof data.price === 'string' ? parseInt(data.price, 10) : data.price,
                    isAvailable: data.isAvailable,
                    isSoldOut: data.isSoldOut,
                    createdAt: data.createdAt,
                    description: data.description,
                    options: data.options || [],
                };

                setMenuDetail(mappedData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('알 수 없는 에러가 발생했습니다.'));
            } finally {
                setLoading(false);
            }
        };

        fetchMenuDetail();
    }, [id]);

    const toggleSoldOut = async () => {
        if (!menuDetail) return;
        
        const newSoldOutStatus = !menuDetail.isSoldOut;
        try {
            const response = await fetch(`/api/admin/menus/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    korName: menuDetail.korName,
                    engName: menuDetail.engName,
                    description: menuDetail.description,
                    price: menuDetail.price,
                    categoryId: menuDetail.categoryId,
                    isAvailable: menuDetail.isAvailable,
                    isSoldOut: newSoldOutStatus,
                    options: menuDetail.options,
                }),
            });

            if (response.ok) {
                setMenuDetail({ ...menuDetail, isSoldOut: newSoldOutStatus });
            }
        } catch (err) {
            console.error('Failed to toggle sold out status', err);
        }
    };

    // Helper map for category names to IDs if needed, but the current backend PUT /api/admin/menus/{id}
    // requires the full MenuFormData. This might be tricky if we don't have all data.
    // However, the backend UpdateMenuCommand seems to need korName, engName, price, categoryId, etc.
    // Let's refine the toggle as it might need full data.
    
    return { menuDetail, loading, error, toggleSoldOut };
}

// Remove temporary mapping as we now have categoryId in data
/*
const dataIdMap: Record<string, string> = {
    '커피': '1',
    '에이드': '2',
    '티': '3',
    '디저트': '4',
};
*/
