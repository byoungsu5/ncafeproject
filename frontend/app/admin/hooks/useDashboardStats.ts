import { useState, useEffect } from 'react';

export interface DashboardStats {
    totalOrderCount: number;
    totalSalesVolume: number;
    totalRevenue: number;
    dailyStats: {
        date: string;
        orderCount: number;
        salesVolume: number;
        revenue: number;
    }[];
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/dashboard/stats');
                if (!response.ok) throw new Error('Failed to fetch stats');
                const data = await response.json();
                setStats(data);
            } catch (err: any) {
                console.error('Dashboard stats fetch error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return { stats, loading, error };
}
