'use client';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailPage() {
    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            padding: '1rem'
        }}>
            <div style={{ 
                maxWidth: '400px', 
                width: '100%', 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '1rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                <AlertCircle size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>결제 실패</h1>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>결제 과정 중 오류가 발생했거나 중단되었습니다.</p>
                <Link 
                    href="/menus"
                    style={{ 
                        display: 'block',
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#f97316',
                        color: 'white',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: 600
                    }}
                >
                    다시 시도하기
                </Link>
            </div>
        </div>
    );
}
