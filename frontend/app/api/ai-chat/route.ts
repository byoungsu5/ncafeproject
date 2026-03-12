import { NextRequest, NextResponse } from 'next/server';

const AI_AGENT_BASE = process.env.AI_AGENT_URL || 'http://localhost:8136';

export async function POST(req: NextRequest) {
    console.log('[AI Chat] Request received');
    try {
        const body = await req.json();
        const url = `${AI_AGENT_BASE}/chat`;
        console.log(`[AI Chat] Runtime AI_AGENT_BASE: ${AI_AGENT_BASE}`);
        console.log(`[AI Chat] Proxying to: ${url}`);

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        console.log(`[AI Chat] AI Agent status: ${res.status}`);

        const data = await res.json();
        if (!res.ok) {
            console.error('[AI Chat] AI Agent error:', data);
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[AI Chat][POST] local error:', message);
        return NextResponse.json(
            { message: `AI agent connection failed: ${message}` },
            { status: 502 },
        );
    }
}

