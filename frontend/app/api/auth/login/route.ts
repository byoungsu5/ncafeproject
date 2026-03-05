import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';

export async function POST(req: NextRequest) {
    const body = await req.json();

    // 1. Spring Boot 로그인 API 호출 (Backend 엔드포인트는 /api/auth/login 이라고 가정)
    // 현재 Backend 설정상 /login (formLogin) 과 /api/auth/login 이 혼재되어 있을 수 있음
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

    // 2. 사용자 정보 조회 (Backend 엔드포인트 /api/auth/me)
    const meRes = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    let user = null;
    if (meRes.ok) {
        user = await meRes.json();
    }

    // 3. 세션에 저장
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
}
