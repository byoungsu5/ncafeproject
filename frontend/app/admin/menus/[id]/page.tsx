'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMenuById } from '@/mocks/menuData';
import { Menu } from '@/types';
import MenuDetailHeader from './_components/MenuDetailHeader';
import MenuDetailInfo from './_components/MenuDetailInfo';
import MenuImages from './_components/MenuImages';
import MenuOptions from './_components/MenuOptions';
import styles from './page.module.css';

export default function MenuDetailPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);

    return (
        <main>
            <MenuDetailHeader
                title="메뉴 상세"
            />
            <div className={styles.pageLayout}>
                <div className={styles.column}>
                    <MenuImages menuId={id} />
                    <MenuDetailInfo id={id} />
                </div>
                <div className={styles.column}>
                    <MenuOptions />
                </div>
            </div>
        </main>
    );
}
