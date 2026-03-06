'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './SiteHeader.module.css';

export default function SiteHeader() {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>
                    🟣 NCafe x 메타몽
                </Link>
                <nav className={styles.nav}>
                    <Link
                        href="/"
                        className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
                    >
                        홈
                    </Link>
                    <Link
                        href="/menus"
                        className={`${styles.navLink} ${pathname.startsWith('/menus') ? styles.navLinkActive : ''}`}
                    >
                        메뉴
                    </Link>
                    <Link
                        href="/chat"
                        className={`${styles.navLink} ${pathname.startsWith('/chat') ? styles.navLinkActive : ''}`}
                    >
                        채팅
                    </Link>
                    {!isLoading && (
                        user ? (
                            <>
                                <Link
                                    href="/admin/menus"
                                    className={`${styles.navLink} ${pathname.startsWith('/admin') ? styles.navLinkActive : ''}`}
                                >
                                    관리자
                                </Link>
                                <button onClick={logout} className={styles.navLink}>
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`${styles.navLink} ${pathname === '/login' ? styles.navLinkActive : ''}`}
                                >
                                    로그인
                                </Link>
                                <Link
                                    href="/signup"
                                    className={`${styles.navLink} ${styles.signupBtn} ${pathname === '/signup' ? styles.navLinkActive : ''}`}
                                >
                                    회원가입
                                </Link>
                            </>
                        )
                    )}
                </nav>
            </div>
        </header>
    );
}
