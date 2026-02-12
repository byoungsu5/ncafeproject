'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MenuImage } from '@/types';
import { ImageIcon } from 'lucide-react';
import styles from './MenuImages.module.css';

interface MenuImagesProps {
    menuId: number | string;
}

export default function MenuImages({ menuId }: MenuImagesProps) {
    const [images, setImages] = useState<MenuImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<MenuImage | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!menuId) return;

        const fetchImages = async () => {
            try {
                const response = await fetch(`/api/admin/menus/${menuId}/menu-images`);
                if (!response.ok) {
                    throw new Error('Failed to fetch menu images');
                }
                const data = await response.json();
                setImages(data.images);
                if (data.images && data.images.length > 0) {
                    // sortOrder: 1 혹은 가장 첫 번째 이미지를 기본 선택
                    const primary = data.images.find((img: MenuImage) => img.isPrimary) || data.images[0];
                    setSelectedImage(primary);
                }
            } catch (error) {
                console.error("Error loading menu images:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [menuId]);

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('/')) return url;
        return `/api/${url}`;
    };

    if (isLoading) {
        return (
            <section className={styles.card}>
                <div className={styles.emptyState}>
                    <span>이미지를 불러오는 중...</span>
                </div>
            </section>
        );
    }

    if (!images || images.length === 0) {
        return (
            <section className={styles.card}>
                <h2 className={styles.sectionTitle}>
                    <ImageIcon size={20} />
                    이미지
                </h2>
                <div className={styles.emptyState}>
                    <ImageIcon size={48} />
                    <span>이미지가 없습니다</span>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.card}>
            <h2 className={styles.sectionTitle}>
                <ImageIcon size={20} />
                이미지
            </h2>

            <div className={styles.primaryImageWrapper}>
                {selectedImage && (
                    <Image
                        src={getImageUrl(selectedImage.url)}
                        alt={selectedImage.altText || "메뉴 상세 이미지"}
                        fill
                        className={styles.primaryImage}
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                )}
                {selectedImage?.isPrimary && (
                    <span className={styles.primaryBadge}>대표 이미지</span>
                )}
            </div>

            <div className={styles.thumbnailGrid}>
                {images.map((image) => (
                    <button
                        key={image.id}
                        className={styles.thumbnailWrapper}
                        onClick={() => setSelectedImage(image)}
                        style={{
                            borderColor: selectedImage?.id === image.id ? 'var(--color-primary-500)' : 'transparent'
                        }}
                    >
                        <Image
                            src={getImageUrl(image.url)}
                            alt={image.altText || "썸네일"}
                            fill
                            className={styles.thumbnailImage}
                            sizes="100px"
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
