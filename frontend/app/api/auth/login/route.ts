import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!loginRes.ok) {
            const error = await loginRes.json().catch(() => ({ message: '로그인에 실패했습니다.' }));
            return NextResponse.json(error, { status: loginRes.status });
        }

        const tokenData = await loginRes.json();
        const token = tokenData.token;

        if (!token) {
            return NextResponse.json({ message: '토큰을 받지 못했습니다.' }, { status: 500 });
        }

        const meRes = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        let user = null;
        if (meRes.ok) {
            user = await meRes.json();
        }

        const session = await getSession();
        session.token = token;
        if (user) {
            session.user = {
                username: user.username,
                roles: user.roles
            };
        }
        await session.save();

        return NextResponse.json({ user: session.user });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Login] failed:', message);
        return NextResponse.json(
            { message: `Backend connection failed: ${message}` },
            { status: 502 }
        );
    }
}
