import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';

async function proxyRequest(req: NextRequest) {
    try {
        const session = await getSession();
        const token = session.token;

        const { pathname, search } = req.nextUrl;

        const targetUrl = `${API_BASE}${pathname}${search}`;

        const headers = new Headers();

        req.headers.forEach((value, key) => {
            if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'cookie') {
                headers.set(key, value);
            }
        });

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
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

        if (proxyRes.status === 401 && token) {
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
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[API Proxy] ${req.method} ${req.nextUrl.pathname} -> ${API_BASE} failed:`, message);
        return NextResponse.json(
            { message: `Backend connection failed: ${message}` },
            { status: 502 }
        );
    }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
