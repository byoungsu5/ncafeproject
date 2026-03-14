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
    categoryName: string;
    price: number;
    isAvailable: boolean;
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
                    categoryName: data.categoryName,
                    price: typeof data.price === 'string' ? parseInt(data.price, 10) : data.price,
                    isAvailable: data.isAvailable,
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

    return { menuDetail, loading, error };
}
