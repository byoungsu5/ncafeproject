import { NextRequest, NextResponse } from 'next/server';
import http from 'http';

const AI_AGENT_BASE = process.env.AI_AGENT_URL || 'http://localhost:8136';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const payload = JSON.stringify(body);

        if (body.stream) {
            const stream = await requestStreamFromAgent(payload);
            return new NextResponse(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive',
                    'X-Accel-Buffering': 'no',
                },
            });
        }

        // 일반 JSON 요청 (스트리밍이 아닌 경우)
        const response = await fetch(`${AI_AGENT_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[AI Chat][POST] error:', message);
        return NextResponse.json(
            { message: `AI agent connection failed: ${message}` },
            { status: 502 },
        );
    }
}

function requestStreamFromAgent(payload: string): Promise<ReadableStream<Uint8Array>> {
    const url = new URL(`${AI_AGENT_BASE}/chat`);

    return new Promise((resolve, reject) => {
        const httpReq = http.request(
            {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + (url.search || ''),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload),
                },
            },
            (res) => {
                if (res.statusCode && res.statusCode >= 400) {
                    reject(new Error(`Agent Server responded with status: ${res.statusCode}`));
                    return;
                }

                const stream = new ReadableStream<Uint8Array>({
                    start(controller) {
                        res.on('data', (chunk: Buffer) => {
                            controller.enqueue(new Uint8Array(chunk));
                        });
                        res.on('end', () => {
                            controller.close();
                        });
                        res.on('error', (err) => {
                            controller.error(err);
                        });
                    },
                    cancel() {
                        res.destroy();
                    },
                });

                resolve(stream);
            }
        );

        httpReq.on('error', reject);
        httpReq.write(payload);
        httpReq.end();
    });
}

