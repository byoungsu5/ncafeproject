import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const res = await fetch(`${API_BASE}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            const message =
                (data && (data.message as string)) ||
                '회원가입에 실패했습니다.';
            return NextResponse.json({ message }, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Signup] failed:', message);
        return NextResponse.json(
            { message: `Backend connection failed: ${message}` },
            { status: 502 },
        );
    }
}

