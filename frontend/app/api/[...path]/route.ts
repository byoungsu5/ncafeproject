import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';

async function proxyRequest(req: NextRequest) {
    try {
        const session = await getSession();
        const token = session.token;

        const { pathname, search } = req.nextUrl;
        console.log(`[API Proxy] Incoming: ${req.method} ${pathname}${search}`);

        const AI_AGENT_BASE = process.env.AI_AGENT_URL || 'http://localhost:8136';

        let targetUrl;
        if (pathname === '/api/ai' || pathname.startsWith('/api/ai/')) {
            targetUrl = `${AI_AGENT_BASE}${pathname}${search}`;
        } else {
            targetUrl = `${API_BASE}${pathname}${search}`;
        }

        console.log(`[API Proxy] Forwarding to: ${targetUrl}`);

        const headers = new Headers();
        const skipHeaders = new Set(['host', 'connection', 'upgrade', 'keep-alive', 'transfer-encoding', 'content-length']);

        req.headers.forEach((value, key) => {
            if (!skipHeaders.has(key.toLowerCase())) {
                headers.set(key, value);
            }
        });

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const proxyRes = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : null,
            // @ts-ignore - duplex is required for streaming request bodies in Node.js fetch
            duplex: 'half',
        });

        if (proxyRes.status >= 400) {
            const errorText = await proxyRes.text().catch(() => 'No error body');
            console.error(`[API Proxy] ${req.method} ${pathname} -> Backend returned ${proxyRes.status} ${proxyRes.statusText}`);
            console.error(`[API Proxy] Error Body: ${errorText.substring(0, 200)}`);
            
            // Re-create the response since we consumed the body
            return new NextResponse(errorText, {
                status: proxyRes.status,
                statusText: proxyRes.statusText,
                headers: {
                    'Content-Type': proxyRes.headers.get('content-type') || 'text/plain'
                },
            });
        }

        if (proxyRes.status === 401 && token) {
            console.log(`[API Proxy] Unauthorized - Destroying session`);
            session.destroy();
        }

        console.log(`[API Proxy] Success: ${req.method} ${pathname} -> ${proxyRes.status}`);

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
