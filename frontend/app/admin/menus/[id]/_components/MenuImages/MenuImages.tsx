'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import styles from './MenuImages.module.css';
import { useMenuImages, MenuImage } from './useMenuImages';

export default function MenuImages({ menuId }: { menuId: string }) {
    const { images, loading, error } = useMenuImages(menuId);
    const [selectedImage, setSelectedImage] = useState<MenuImage | null>(null);

    // 기본 이미지 설정 (데이터 로드 후 첫 번째 이미지)
    const displayImage = selectedImage || (images.length > 0 ? images[0] : null);

    if (loading) return <div className={styles.loading}>이미지 로딩 중...</div>;

    // 이미지 기본 경로 (next.config.ts의 rewrites 설정에 맞춤)
    const baseUrl = '/images';

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${baseUrl}/${url}`;
    };

    return (
        <section className={styles.card}>
            <h2 className={styles.sectionTitle}>
                <ImageIcon size={20} />
                이미지
            </h2>

            <div className={styles.primaryImageWrapper}>
                {displayImage ? (
                    <Image
                        src={getImageUrl(displayImage.url)}
                        alt={displayImage.altText || `메뉴 이미지`}
                        fill
                        className={styles.primaryImage}
                    />
                ) : (
                    <div className={styles.emptyState}>
                        <ImageIcon size={48} color="#9ca3af" />
                        <span>이미지 영역</span>
                    </div>
                )}
            </div>

            <div className={styles.thumbnailGrid}>
                {images.map((image) => (
                    <button
                        key={image.id}
                        className={`${styles.thumbnailWrapper} ${displayImage?.id === image.id ? styles.activeThumbnail : ''}`}
                        onClick={() => setSelectedImage(image)}
                    >
                        <Image
                            src={getImageUrl(image.url)}
                            alt={image.altText || `썸네일`}
                            fill
                            className={styles.thumbnailImage}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
