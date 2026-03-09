import Link from 'next/link';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <span className={styles.logo}>🔥 파이리 Cafe</span>
                        <p className={styles.tagline}>당신의 공간을 파이리가 채워줍니다.</p>
                    </div>
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.navLink}>홈</Link>
                        <Link href="/menus" className={styles.navLink}>메뉴</Link>
                    </nav>
                </div>

                <div className={styles.divider} />

                <div className={styles.bottom}>
                    <div className={styles.info}>
                        <span>대표자: 파이리</span>
                        <span className={styles.dot} />
                        <span>사업자번호: 132-18-11111</span>
                        <span className={styles.dot} />
                        <span>연락처: 02-9999-8888</span>
                        <span className={styles.dot} />
                        <span>이메일: support@파이리cafe.com</span>
                    </div>
                    <p className={styles.copyright}>&copy; {new Date().getFullYear()} 파이리Cafe. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
