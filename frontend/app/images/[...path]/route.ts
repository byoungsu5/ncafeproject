import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const imagePath = path.join('/');
    
    const API_BASE = process.env.API_BASE_URL || 'http://localhost:8036';
    const targetUrl = `${API_BASE}/upload/${imagePath}`;

    try {
        const res = await fetch(targetUrl);

        if (!res.ok) {
            return new NextResponse(null, { status: res.status });
        }

        const headers = new Headers();
        const contentType = res.headers.get('content-type');
        if (contentType) headers.set('Content-Type', contentType);

        const cacheControl = res.headers.get('cache-control');
        headers.set('Cache-Control', cacheControl || 'public, max-age=86400');

        return new NextResponse(res.body, { status: 200, headers });
    } catch {
        return new NextResponse(null, { status: 502 });
    }
}
