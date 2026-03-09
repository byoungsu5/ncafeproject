import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';

export async function GET() {
    try {
        const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'GET',
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            const message =
                (data && (data.message as string)) ||
                '채팅 메시지를 불러오지 못했습니다.';
            return NextResponse.json({ message }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Chat][GET] failed:', message);
        return NextResponse.json(
            { message: `Backend connection failed: ${message}` },
            { status: 502 },
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            const message =
                (data && (data.message as string)) ||
                '메시지를 전송하지 못했습니다.';
            return NextResponse.json({ message }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Chat][POST] failed:', message);
        return NextResponse.json(
            { message: `Backend connection failed: ${message}` },
            { status: 502 },
        );
    }
}

