export async function* sendMessageStream(
    history: { role: string; content: string }[],
): AsyncGenerator<any, void, unknown> {
    const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: history,
            stream: true,
        }),
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    if (!response.body) {
        throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // TextDecoder with stream: true to handle multi-byte characters (like Korean) split between chunks
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        // Keep the last partial line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
            if (data === '[DONE]') return;

            try {
                const parsed = JSON.parse(data);
                
                if (parsed.calls && parsed.calls.length > 0) {
                    for (const call of parsed.calls) {
                        if (call.name === 'navigate_to' && call.args && call.args.path) {
                            yield { action: { action: 'navigate', url: call.args.path } } as any;
                        }
                    }
                }
                
                if (parsed.content) {
                    yield parsed.content;
                }
                
                if (parsed.action) {
                    yield { action: parsed.action } as any;
                }
            } catch (e) {
                // Ignore incomplete JSON
                console.warn('Failed to parse SSE line:', trimmed, e);
            }
        }
    }
}
