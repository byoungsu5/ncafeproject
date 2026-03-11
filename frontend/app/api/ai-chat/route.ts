import { NextRequest, NextResponse } from 'next/server';
import http from 'http';

const AI_AGENT_BASE = process.env.AI_AGENT_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const url = new URL(`${AI_AGENT_BASE}/chat`);

        const responseData = await new Promise((resolve, reject) => {
            const requestData = JSON.stringify(body);
            const options = {
                hostname: url.hostname,
                port: url.port || 80,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestData),
                },
            };

            const clientReq = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    const statusCode = res.statusCode || 500;
                    try {
                        const parsed = JSON.parse(data);
                        resolve({ status: statusCode, data: parsed });
                    } catch (e) {
                        resolve({ status: statusCode, data: { content: data } });
                    }
                });
            });

            clientReq.on('error', (e) => {
                reject(e);
            });

            clientReq.write(requestData);
            clientReq.end();
        }) as { status: number, data: any };

        if (responseData.status >= 400) {
            return NextResponse.json(responseData.data, { status: responseData.status });
        }

        return NextResponse.json(responseData.data, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[AI Chat][POST] error:', message);
        return NextResponse.json(
            { message: `AI agent connection failed: ${message}` },
            { status: 502 },
        );
    }
}
