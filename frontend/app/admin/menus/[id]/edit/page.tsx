'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MenuForm from '../../_components/MenuForm';
import { MenuFormData } from '@/types';
import { fetchAPI, uploadFile } from '@/app/lib/api';
import styles from './page.module.css';

interface EditMenuPageProps {
    params: Promise<{ id: string }>;
}

export default function EditMenuPage({ params }: EditMenuPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [initialData, setInitialData] = useState<Partial<MenuFormData> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const [menuData, imageData] = await Promise.all([
                    fetchAPI(`/admin/menus/${id}`, { cache: 'no-store' }),
                    fetchAPI(`/admin/menus/${id}/menu-images`, { cache: 'no-store' })
                ]);
                
                if (menuData) {
                    setInitialData({
                        korName: menuData.korName,
                        engName: menuData.engName,
                        description: menuData.description,
                        price: menuData.price,
                        categoryId: String(menuData.categoryId),
                        isAvailable: menuData.isAvailable,
                        isSoldOut: menuData.isSoldOut,
                        images: imageData || [],
                        options: menuData.options || [],
                    });
                }
            } catch {
                setInitialData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenu();
    }, [id]);

    const handleSubmit = async (data: MenuFormData) => {
        setIsSubmitting(true);
        try {
            // 이미지 업로드 처리
            const imagePromises = data.images.map(async (img) => {
                if (img.file) {
                    const uploadRes = await uploadFile(img.file);
                    return {
                        url: uploadRes.url,
                        isPrimary: img.isPrimary,
                        sortOrder: img.sortOrder
                    };
                }
                return {
                    url: img.url,
                    isPrimary: img.isPrimary,
                    sortOrder: img.sortOrder
                };
            });

            const uploadedImages = await Promise.all(imagePromises);

            await fetchAPI(`/admin/menus/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    korName: data.korName,
                    engName: data.engName,
                    description: data.description,
                    price: data.price,
                    categoryId: Number(data.categoryId),
                    isAvailable: data.isAvailable,
                    isSoldOut: data.isSoldOut,
                    slug: data.slug,
                    images: uploadedImages,
                    options: data.options,
                }),
            });
            router.refresh(); // 캐시 무효화
            router.push(`/admin/menus/${id}`);
        } catch (error) {
            alert(error instanceof Error ? error.message : '메뉴 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">메뉴 정보를 불러오는 중입니다...</div>;
    }

    if (!initialData) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-4">메뉴를 찾을 수 없습니다</h2>
                <Link
                    href="/admin/menus"
                    className="text-blue-500 hover:underline"
                >
                    목록으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.bgGlow1} />
            <div className={styles.bgGlow2} />
            <div className={styles.bgGrid} />

            <div className={styles.container}>
                <div className={styles.content}>
                    <header className={styles.header}>
                        <Link href={`/admin/menus/${id}`} className={styles.backButton} aria-label="상세 페이지로 돌아가기">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className={styles.title}>메뉴 수정</h1>
                    </header>

                    <MenuForm
                        defaultValues={initialData}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        submitLabel="수정사항 저장"
                    />
                </div>
            </div>
        </main>
    );
}
