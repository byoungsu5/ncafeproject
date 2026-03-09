import SiteHeader from './_components/SiteHeader';
import ChatWidget from './_components/ChatWidget';
import SiteFooter from './_components/SiteFooter';
import styles from './layout.module.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.layout}>
            <SiteHeader />
            <div className={styles.main}>
                {children}
            </div>
            <SiteFooter />
            <ChatWidget />
        </div>
    );
}
