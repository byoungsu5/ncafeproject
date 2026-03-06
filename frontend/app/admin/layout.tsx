'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from './_components/AdminSidebar';
import AdminHeader from './_components/AdminHeader';
import AdminFooter from './_components/AdminFooter';
import styles from './layout.module.css';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else {
                const isAdmin = user.roles?.some(role =>
                    typeof role === 'string' ? role === 'ROLE_ADMIN' : role.authority === 'ROLE_ADMIN'
                );
                if (!isAdmin) {
                    router.push('/menus');
                }
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className={styles.loading}>몽글몽글 인증 확인 중...</div>;
    }

    if (!user) {
        return null; // Redirecting...
    }

    return (
        <div className={styles.layout}>
            <AdminSidebar />
            <div className={styles.pageWrapper}>
                <AdminHeader />
                <div className={styles.content}>
                    {children}
                </div>
                <AdminFooter />
            </div>
        </div>
    );
}

