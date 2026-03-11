'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { Package, CheckCircle, XCircle, Clock } from 'lucide-react';

interface OrderItem {
    id: number;
    menuId: number;
    menuName: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    nickname: string;
    totalPrice: number;
    status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
    items: OrderItem[];
    orderTime: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchOrders = async (isSilent = false) => {
        if (!isSilent) setIsLoading(true);
        else setIsRefreshing(true);
        
        try {
            const response = await fetch('/api/admin/orders', {
                cache: 'no-store' // 캐시 방지하여 최신 데이터 강제
            });
            if (response.ok) {
                const data = await response.json();
                const orderList = Array.isArray(data) ? data : (data.content || []);
                // 최신 주문이 위로 오도록 정렬 (id 역순)
                const sortedList = [...orderList].sort((a, b) => b.id - a.id);
                setOrders(sortedList);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        
        // 10초마다 자동 갱신
        const timer = setInterval(() => {
            fetchOrders(true);
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                fetchOrders(true);
            } else {
                alert('상태 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return (
                    <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                        <Clock size={14} style={{ marginRight: '4px' }} />
                        대기 중
                    </span>
                );
            case 'ACCEPTED':
                return (
                    <span className={`${styles.statusBadge} ${styles.statusCompleted}`} style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                        <Package size={14} style={{ marginRight: '4px' }} />
                        준비 중
                    </span>
                );
            case 'COMPLETED':
                return (
                    <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
                        <CheckCircle size={14} style={{ marginRight: '4px' }} />
                        완료됨
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className={`${styles.statusBadge} ${styles.statusCancelled}`}>
                        <XCircle size={14} style={{ marginRight: '4px' }} />
                        취소됨
                    </span>
                );
            default:
                return status;
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.bgGlow1} />
            <div className={styles.bgGlow2} />
            <div className={styles.bgGrid} />

            <div className={styles.container}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 className={styles.title}>주문 관리</h1>
                            <p className={styles.subtitle}>실시간으로 주문 내역을 확인하고 관리할 수 있습니다.</p>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                마지막 업데이트: {lastUpdated.toLocaleTimeString()}
                                {isRefreshing && ' (갱신 중...)'}
                            </span>
                            <button 
                                onClick={() => fetchOrders()} 
                                className={styles.actionButton}
                                disabled={isLoading || isRefreshing}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Clock size={14} /> 새로고침
                            </button>
                        </div>
                    </div>
                </header>

                <div className={styles.card}>
                    {isLoading ? (
                        <div className={styles.loading}>주문 내역을 불러오는 중...</div>
                    ) : orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Package size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <p>접수된 주문이 없습니다.</p>
                        </div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>주문 번호</th>
                                        <th>주문자</th>
                                        <th>메뉴 내역</th>
                                        <th>총 결제금액</th>
                                        <th>주문 상태</th>
                                        <th>주문 시간</th>
                                        <th>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className={styles.orderId}>#{order.id}</td>
                                            <td className={styles.userName}>{order.nickname}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>
                                                    {order.items && order.items.length > 0 ? order.items[0].menuName : '메뉴 정보 없음'}
                                                    {order.items && order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : ''}
                                                </div>
                                                <div className={styles.itemsList}>
                                                    {order.items?.map(item => `${item.menuName} x${item.quantity}`).join(', ') || ''}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 700 }}>{order.totalPrice.toLocaleString()}원</td>
                                            <td>{getStatusBadge(order.status)}</td>
                                            <td>{formatDate(order.orderTime)}</td>
                                            <td className={styles.actions}>
                                                {order.status === 'PENDING' && (
                                                    <>
                                                        <button 
                                                            className={`${styles.actionButton} ${styles.completeButton}`}
                                                            onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                                        >
                                                            주문 완료
                                                        </button>
                                                        <button 
                                                            className={styles.actionButton}
                                                            onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                                        >
                                                            취소
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
