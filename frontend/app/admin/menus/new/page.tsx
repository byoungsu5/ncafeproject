'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import MenuForm from '../_components/MenuForm';
import { MenuFormData } from '@/types';
import { fetchAPI, uploadFile } from '@/app/lib/api';
import styles from './page.module.css';

export default function NewMenuPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

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

            await fetchAPI('/admin/menus', {
                method: 'POST',
                body: JSON.stringify({
                    korName: data.korName,
                    engName: data.engName,
                    slug: data.slug,
                    description: data.description,
                    price: data.price,
                    categoryId: Number(data.categoryId),
                    isAvailable: data.isAvailable,
                    isSoldOut: data.isSoldOut,
                    images: uploadedImages,
                    options: data.options,
                }),
            });
            router.push('/admin/menus');
        } catch (error) {
            alert(error instanceof Error ? error.message : '메뉴 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin/menus" className={styles.backButton} aria-label="목록으로 돌아가기">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className={styles.title}>새 메뉴 등록</h1>
            </header>

            <MenuForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="메뉴 등록하기"
            />
        </main>
    );
}
