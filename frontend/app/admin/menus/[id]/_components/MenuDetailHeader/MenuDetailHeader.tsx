'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { fetchAPI } from '@/app/lib/api';
import styles from './MenuDetailHeader.module.css';

interface MenuDetailHeaderProps {
    id: string;
    title?: string;
}

export default function MenuDetailHeader({ id, title }: MenuDetailHeaderProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) return;

        try {
            await fetchAPI(`/admin/menus/${id}`, { method: 'DELETE' });
            router.push('/admin/menus');
        } catch (error) {
            alert(error instanceof Error ? error.message : '메뉴 삭제에 실패했습니다.');
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <Link href="/admin/menus" className={styles.backButton} aria-label="목록으로 돌아가기">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className={styles.title}>{title || '메뉴 상세'}</h1>
            </div>

            <div className={styles.actions}>
                <Link
                    href={`/admin/menus/${id}/edit`}
                    className={`${styles.actionButton} ${styles.editButton}`}
                >
                    <Edit2 size={16} />
                    수정
                </Link>
                <button
                    onClick={handleDelete}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                    <Trash2 size={16} />
                    삭제
                </button>
            </div>
        </header>
    );
}
