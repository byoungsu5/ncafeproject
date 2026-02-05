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

interface MenuDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function MenuDetailPage({ params }: MenuDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [menu, setMenu] = useState<Menu | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const foundMenu = getMenuById(id);
        setMenu(foundMenu);
        setIsLoading(false);
    }, [id]);

    const handleDelete = () => {
        if (window.confirm('정말 이 메뉴를 삭제하시겠습니까?')) {
            alert('메뉴가 삭제되었습니다.');
            router.push('/admin/menus');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">메뉴 정보를 불러오는 중입니다...</div>;
    }

    if (!menu) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-4">메뉴를 찾을 수 없습니다</h2>
                <button
                    onClick={() => router.push('/admin/menus')}
                    className="text-blue-500 hover:underline"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <main>
            <MenuDetailHeader
                title={menu.korName}
                menuId={menu.id}
                onDelete={handleDelete}
            />

            <div className={styles.pageLayout}>
                <div className={styles.column}>
                    <MenuImages images={menu.images} altText={menu.korName} />
                    <MenuDetailInfo menu={menu} />
                </div>

                <div className={styles.column}>
                    <MenuOptions options={menu.options} />
                </div>
            </div>
        </main>
    );
}
