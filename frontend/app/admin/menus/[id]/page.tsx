'use client';

import { use } from 'react';
import MenuDetailHeader from './_components/MenuDetailHeader';
import MenuDetailInfo from './_components/MenuDetailInfo';
import MenuImages from './_components/MenuImages';
import MenuOptions from './_components/MenuOptions';
import styles from './page.module.css';

export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <main>
            <MenuDetailHeader
                id={id}
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
