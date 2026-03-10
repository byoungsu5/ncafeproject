'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Coffee,
    ShoppingBag,
    Settings,
    Users,
    BarChart3,
    Package,
    LogOut,
    FileText
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './AdminSidebar.module.css';

const navItems = [
    {
        section: '메인',
        items: [
            { href: '/admin', label: '대시보드', icon: LayoutDashboard },
        ],
    },
    {
        section: '메뉴 관리',
        items: [
            { href: '/admin/menus', label: '메뉴 관리', icon: Coffee },
        ],
    },
    {
        section: '주문 관리',
        items: [
            { href: '/admin/orders', label: '주문 내역', icon: ShoppingBag },
        ],
    },
    {
        section: 'RAG 관리',
        items: [
            { href: '/admin/rag', label: '문서 관리', icon: FileText },
        ],
    },
    {
        section: '기타',
        items: [
            { href: '/admin/settings', label: '설정', icon: Settings },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const { user, logout } = useAuth();

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logo}>
                <div className={styles.logoText}>
                    <span className={styles.logoIcon}>🟣</span>
                    NCafe Admin
                </div>
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                {navItems.map((section) => (
                    <div key={section.section} className={styles.navSection}>
                        <div className={section.section !== '메인' ? styles.navSectionTitle : styles.hiddenTitle}>{section.section}</div>
                        <ul className={styles.navList}>
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                                        >
                                            <Icon className={styles.navIcon} />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer - Cafe Info & Logout */}
            <div className={styles.footer}>
                <div className={styles.cafeInfo}>
                    <div className={styles.cafeAvatar}>💜</div>
                    <div>
                        <div className={styles.cafeName}>{user?.username || '관리자'}</div>
                        <div className={styles.cafeRole}>{user?.roles.some(r => typeof r === 'string' ? r === 'ROLE_ADMIN' : r.authority === 'ROLE_ADMIN') ? '수퍼바이저' : '스태프'}</div>
                    </div>
                </div>
                <button onClick={logout} className={styles.logoutButton}>
                    <LogOut size={16} />
                    <span>로그아웃</span>
                </button>
            </div>
        </aside>
    );
}
