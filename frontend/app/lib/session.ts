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

const DEFAULT_SECRET = 'JQvH/BoClMe32u3gbIXxmf+VBxRisvakVC/HbrihT+s=';
const secret = process.env.SESSION_SECRET || DEFAULT_SECRET;

if (secret.length < 32) {
    console.error(`[Session] SESSION_SECRET is too short (${secret.length} chars). Must be >= 32. Using default.`);
}

export const sessionOptions: SessionOptions = {
    password: secret.length >= 32 ? secret : DEFAULT_SECRET,
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
