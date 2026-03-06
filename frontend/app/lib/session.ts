import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

// ──────────────────────────────────────
// 세션에 저장할 사용자 정보 타입
// ──────────────────────────────────────
export interface SessionUser {
    username: string;
    roles: any[];
}

export interface SessionData {
    token: string;      // Spring Boot에서 발급받은 JWT (현재는 placeholder)
    user: SessionUser;  // 사용자 정보
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: 'app_session',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24,
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    return getIronSession<SessionData>(cookieStore, sessionOptions);
}
