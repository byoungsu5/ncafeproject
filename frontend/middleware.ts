import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/admin'];
const PUBLIC_PATHS = ['/login', '/signup', '/api', '/_next', '/favicon.ico'];
const SESSION_COOKIE_NAME = 'app_session';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 정적 리소스 및 공개 경로는 통과
    if (
        PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // 보호된 경로 확인
    const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);

    if (isProtected && !sessionCookie) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
