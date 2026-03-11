import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        const body = await req.json();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (session.token) {
            headers['Authorization'] = `Bearer ${session.token}`;
        }

        const res = await fetch(`${API_BASE}/api/orders`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: '주문 요청에 실패했습니다.' }));
            return NextResponse.json(error, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Orders API] error:', message);
        return NextResponse.json(
            { message: `Internal server error: ${message}` },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session.token) {
            return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
        }

        const res = await fetch(`${API_BASE}/api/orders/me`, {
            headers: { Authorization: `Bearer ${session.token}` },
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: '주문 내역을 가져오는데 실패했습니다.' }));
            return NextResponse.json(error, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ message }, { status: 500 });
    }
}
