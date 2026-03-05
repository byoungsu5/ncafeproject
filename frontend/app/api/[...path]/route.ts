import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';

async function proxyRequest(req: NextRequest) {
    const session = await getSession();
    const { pathname, search } = req.nextUrl;

    // /api 부분을 제외한 실제 백엔드 경로
    const targetUrl = `${API_BASE}${pathname}${search}`;

    const headers = new Headers();

    // 클라이언트로부터 온 헤더 복사 (Content-Type 등)
    req.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'cookie') {
            headers.set(key, value);
        }
    });

    // ★ 핵심: 세션에 JWT가 있으면 Authorization 헤더 주입
    if (session.token) {
        headers.set('Authorization', `Bearer ${session.token}`);
    }

    let body: BodyInit | null = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        const contentType = req.headers.get('content-type');
        if (contentType?.includes('multipart/form-data')) {
            body = await req.blob();
        } else {
            body = await req.text();
        }
    }

    const proxyRes = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
    });

    // 401 응답 시 세션 파기
    if (proxyRes.status === 401 && session.token) {
        session.destroy();
    }

    const responseHeaders = new Headers();
    const resContentType = proxyRes.headers.get('content-type');
    if (resContentType) {
        responseHeaders.set('Content-Type', resContentType);
    }

    return new NextResponse(proxyRes.body, {
        status: proxyRes.status,
        statusText: proxyRes.statusText,
        headers: responseHeaders,
    });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
