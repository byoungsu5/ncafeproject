import { NextRequest, NextResponse } from 'next/server';

const AI_AGENT_BASE = process.env.AI_AGENT_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const res = await fetch(`${AI_AGENT_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            const message =
                (data && (data.message as string)) ||
                'AI 서버와 통신 중 오류가 발생했습니다.';
            return NextResponse.json({ message }, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[AI Chat][POST] failed:', message);
        return NextResponse.json(
            { message: `AI agent connection failed: ${message}` },
            { status: 502 },
        );
    }
}

