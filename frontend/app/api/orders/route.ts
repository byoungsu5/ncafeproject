import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

export async function POST(req: NextRequest) {
    const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';
    console.log('[BFF] POST /api/orders request received');
    try {
        const session = await getSession();
        const body = await req.json();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (session.token) {
            headers['Authorization'] = `Bearer ${session.token}`;
            console.log('[BFF] Token found for POST');
        } else {
            console.warn('[BFF] No token found for POST - will be saved as Guest');
        }

        const targetUrl = `${API_BASE}/api/orders`;
        console.log('[BFF] Forwarding POST to:', targetUrl);

        const res = await fetch(targetUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        console.log('[BFF] Backend POST response status:', res.status);

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: '주문 요청에 실패했습니다.' }));
            console.error('[BFF] Backend POST error:', error);
            return NextResponse.json(error, { status: res.status });
        }

        const data = await res.json();
        console.log('[BFF] Order created successfully, id:', data?.id);
        return NextResponse.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[BFF] POST unexpected error:', message);
        return NextResponse.json(
            { message: `Internal server error: ${message}` },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';
    console.log('[BFF] GET /api/orders request received');
    try {
        const session = await getSession();
        console.log('[BFF] Session user:', session.user?.username, 'Token present:', !!session.token);
        
        if (!session.token) {
            console.warn('[BFF] Unauthorized: No session token found');
            return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
        }

        const targetUrl = `${API_BASE}/api/orders`;
        console.log('[BFF] Forwarding GET to Backend:', targetUrl);

        const res = await fetch(targetUrl, {
            headers: { 
                'Authorization': `Bearer ${session.token}`,
                'Accept': 'application/json'
            },
            cache: 'no-store'
        });

        console.log('[BFF] Backend Response:', res.status, res.statusText);

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: '주문 내역을 가져오는데 실패했습니다.' }));
            console.error('[BFF] Backend error:', error);
            return NextResponse.json(error, { status: res.status });
        }

        const data = await res.json();
        console.log('[BFF] Successfully fetched', data?.length, 'orders');
        return NextResponse.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[BFF] Unexpected error:', message);
        return NextResponse.json({ message }, { status: 500 });
    }
}
