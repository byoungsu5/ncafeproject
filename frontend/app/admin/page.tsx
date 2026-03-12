'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, DollarSign, LayoutDashboard, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { useDashboardStats } from './hooks/useDashboardStats';
import styles from './page.module.css';
import { 
    ResponsiveContainer, BarChart, Bar, LineChart, Line, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell 
} from 'recharts';

export default function AdminDashboard() {
    const { stats, loading, error } = useDashboardStats();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>데이터를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>데이터를 불러오는 데 실패했습니다.</div>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const formatChartDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split('-');
        return `${m}/${d}`;
    };

    const chartData = stats?.dailyStats.map(stat => ({
        ...stat,
        formattedDate: formatChartDate(stat.date)
    })) || [];

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    <LayoutDashboard size={28} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    대시보드
                </h1>
                <p className={styles.subtitle}>매장 운영 현황과 매출 트렌드를 분석합니다.</p>
            </header>

            {/* Summary Statistics Cards */}
            <div className={styles.grid}>
                <div className={styles.card}>
                    <div className={styles.cardIcon}>
                        <ShoppingBag size={24} />
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardLabel}>총 주문 수</span>
                        <span className={styles.cardValue}>
                            {stats?.totalOrderCount ?? 0}
                            <span className={styles.currency}>건</span>
                        </span>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardIcon} style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardLabel}>총 판매 수량</span>
                        <span className={styles.cardValue}>
                            {stats?.totalSalesVolume ?? 0}
                            <span className={styles.currency}>개</span>
                        </span>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardIcon} style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardLabel}>총 판매 수익</span>
                        <span className={styles.cardValue}>
                            {formatPrice(stats?.totalRevenue ?? 0)}
                            <span className={styles.currency}>원</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            {isClient && (
                <div className={styles.chartsGrid}>
                    {/* 매출 트렌드 그래프 */}
                    <div className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
                        <h2 className={styles.chartTitle}>
                            <LineChartIcon size={20} />
                            최근 7일 매출 트렌드 (원)
                        </h2>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                                    <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} tickFormatter={(value) => `${value / 10000}만`} />
                                    <Tooltip 
                                        formatter={(value: number) => [formatPrice(value) + '원', '매출액']}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="var(--color-primary-500)" 
                                        strokeWidth={3} 
                                        dot={{ r: 4, fill: 'var(--color-primary-500)', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 주문 및 판매량 바 차트 */}
                    <div className={styles.chartCard}>
                        <h2 className={styles.chartTitle}>
                            <BarChart3 size={20} />
                            일별 주문 및 판매량
                        </h2>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                                    <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 11 }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="orderCount" name="주문 수" fill="var(--color-info)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="salesVolume" name="판매 수량" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 주문당 평균 매출 등 추가 분석 (메모용) */}
                    <div className={styles.chartCard}>
                        <h2 className={styles.chartTitle}>
                            <TrendingUp size={20} />
                            요일별 통계 인사이트
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '20px 0' }}>
                            {chartData.map((day, idx) => (
                                <div key={idx} style={{ flex: '1 1 120px', padding: '15px', background: 'var(--bg-secondary)', borderRadius: '12px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', marginBottom: '5px' }}>{day.date}</div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                        {day.orderCount > 0 ? formatPrice(Math.round(day.revenue / day.orderCount)) : 0}원
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>객단가(주문당 평균)</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
