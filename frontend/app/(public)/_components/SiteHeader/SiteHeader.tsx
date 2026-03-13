'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/src/entities/cart/model/store';
import styles from './SiteHeader.module.css';

export default function SiteHeader() {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();
    const itemCount = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0),
    );

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>
                    🔥 파이리 Cafe
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
                    {user && (
                        <Link
                            href="/orders"
                            className={`${styles.navLink} ${pathname === '/orders' ? styles.navLinkActive : ''}`}
                        >
                            주문현황
                        </Link>
                    )}
                    <Link
                        href="/cart"
                        className={`${styles.navLink} ${pathname.startsWith('/cart') ? styles.navLinkActive : ''}`}
                    >
                        장바구니
                        {itemCount > 0 && (
                            <span className={styles.cartBadge}>{itemCount}</span>
                        )}
                    </Link>
                    {!isLoading && (
                        user ? (
                            <>
                                <Link
                                    href="/admin/menus"
                                    className={`${styles.navLink} ${pathname.startsWith('/admin') ? styles.navLinkActive : ''}`}
                                >
                                    {user.username}님
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
