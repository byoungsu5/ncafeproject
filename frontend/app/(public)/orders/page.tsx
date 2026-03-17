'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Coffee, Clock, Package, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface OrderItem {
    id: number;
    menuId: number;
    menuName: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    totalPrice: number;
    status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
    items: OrderItem[];
    orderTime: string;
}

export default function OrdersPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data || []);
                }
            } catch (error) {
                console.error('주문 내역 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchOrders();
            // 10초마다 실시간 업데이트 (폴링)
            const interval = setInterval(fetchOrders, 10000);
            return () => clearInterval(interval);
        }
    }, [user, isAuthLoading, router]);

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'PENDING': return <Clock size={18} />;
            case 'ACCEPTED': return <Package size={18} />;
            case 'COMPLETED': return <CheckCircle size={18} />;
            case 'CANCELLED': return <XCircle size={18} />;
            default: return null;
        }
    };

    const getStatusText = (status: Order['status']) => {
        switch (status) {
            case 'PENDING': return '주문 대기';
            case 'ACCEPTED': return '준비 중';
            case 'COMPLETED': return '조리 완료';
            case 'CANCELLED': return '주문 취소';
            default: return status;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isAuthLoading || isLoading) {
        return (
            <main className={styles.page}>
                <div className={styles.loading}>
                    파이리가 주문 문서를 뒤적거리고 있어요... 🔥
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.bgGlow1} />
            <div className={styles.bgGlow2} />
            <div className={styles.bgGrid} />

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.heroLabel}>
                        <span className={styles.heroDot}></span>
                        나의 주문
                    </span>
                    <h1 className={styles.heroTitle}>
                        주문 <span className={styles.heroHighlight}>현황</span>
                    </h1>
                    <p className={styles.heroDescription}>
                        파이리가 준비 중인 메뉴의 상태를 실시간으로 확인하세요!
                        <br />
                        맛있는 냄새가 여기까지 나는 것 같아요 🔥
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className={styles.content}>
                <div className={styles.container}>
                    <Link href="/" className={styles.backLink} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', marginBottom: '2rem', textDecoration: 'none', fontWeight: 700 }}>
                        <ChevronLeft size={20} /> 홈으로 돌아가기
                    </Link>

                {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>☕</span>
                        <h2 className={styles.emptyTitle}>아직 주문한 내역이 없어요!</h2>
                        <p className={styles.emptyText}>파이리의 맛있는 메뉴들을 구경하러 가보실래요?</p>
                        <Link href="/menus" className={styles.goMenuBtn}>
                            메뉴 구경하기
                        </Link>
                    </div>
                ) : (
                    <div className={styles.orderList}>
                        {orders.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.orderInfo}>
                                        <span className={styles.orderNumber}>주문 번호 #{order.id}</span>
                                        <span className={styles.orderDate}>{formatDate(order.orderTime)}</span>
                                    </div>
                                    <div className={`${styles.statusBadge} ${styles['status' + order.status]}`}>
                                        {getStatusIcon(order.status)}
                                        {getStatusText(order.status)}
                                    </div>
                                </div>

                                <div className={styles.itemsContainer}>
                                    {order.items.map((item) => (
                                        <div key={item.id} className={styles.item}>
                                            <div className={styles.itemName}>
                                                {item.menuName}
                                                <span className={styles.itemQuantity}>x {item.quantity}</span>
                                            </div>
                                            <span className={styles.itemPrice}>
                                                {(item.price * item.quantity).toLocaleString()}원
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.cardFooter}>
                                    <span className={styles.totalLabel}>총 결제 금액</span>
                                    <span className={styles.totalPrice}>{order.totalPrice.toLocaleString()}원</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </section>
        </main>
    );
}
