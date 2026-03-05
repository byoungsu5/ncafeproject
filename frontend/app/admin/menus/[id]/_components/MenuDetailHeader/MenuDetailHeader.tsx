'use client';

import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import styles from './MenuDetailHeader.module.css';

interface MenuDetailHeaderProps {
    id: string;
    title?: string;
}

export default function MenuDetailHeader({ id, title }: MenuDetailHeaderProps) {
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
                    onClick={() => { }}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                    <Trash2 size={16} />
                    삭제
                </button>
            </div>
        </header>
    );
}
