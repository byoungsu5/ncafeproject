'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';
import { MenuDetailHero, MenuDetailContent, useMenu } from '../_components/MenuDetail';

export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { menu, loading } = useMenu(id);

    if (loading) {
        return (
            <main className={styles.detailWrapper}>
                <div className={styles.backRow}>
                    <Link href="/menus" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        목록으로
                    </Link>
                </div>
                <div className={styles.layout}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonContent}>
                        <div className={styles.skeletonBadge} />
                        <div className={styles.skeletonTitle} />
                        <div className={styles.skeletonText} />
                        <div className={styles.skeletonPrice} />
                    </div>
                </div>
            </main>
        );
    }

    if (!menu) {
        return (
            <main className={styles.detailWrapper}>
                <div className={styles.backRow}>
                    <Link href="/menus" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        목록으로
                    </Link>
                </div>
                <div className={styles.notFound}>
                    <p>메뉴를 찾을 수 없습니다.</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.detailWrapper}>
            <div className={styles.backRow}>
                <Link href="/menus" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    목록으로
                </Link>
            </div>
            <div className={styles.layout}>
                <div className={styles.imageColumn}>
                    <MenuDetailHero
                        imageSrc={menu.imageSrc}
                        korName={menu.korName}
                        isSoldOut={menu.isSoldOut}
                    />
                </div>
                <div className={styles.infoColumn}>
                    <MenuDetailContent
                        korName={menu.korName}
                        engName={menu.engName}
                        price={menu.price}
                        categoryName={menu.categoryName}
                        description={menu.description}
                    />
                </div>
            </div>
        </main>
    );
}
