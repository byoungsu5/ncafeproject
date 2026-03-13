import SiteHeader from './_components/SiteHeader';
import ChatWidget from './_components/ChatWidget';
import SiteFooter from './_components/SiteFooter';
import CartConfirmModal from '@/src/shared/ui/CartConfirmModal/CartConfirmModal';
import OrderModal from '@/src/shared/ui/OrderModal/OrderModal';
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
            <CartConfirmModal />
            <OrderModal />
        </div>
    );
}
