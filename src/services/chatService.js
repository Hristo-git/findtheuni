/**
 * Chat service abstraction layer.
 * Decouples AIChatbot from direct vendor SDK usage.
 * When a server endpoint is available, just update this file.
 */

const VITE_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

let anthropicClient = null;

async function getClient() {
  if (anthropicClient) return anthropicClient;
  if (!VITE_KEY) return null;
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  anthropicClient = new Anthropic({ apiKey: VITE_KEY, dangerouslyAllowBrowser: true });
  return anthropicClient;
}

/**
 * Send a chat message and get an AI reply.
 * Tries: 1) server endpoint  2) browser SDK  3) returns null (caller should fallback)
 */
export async function sendChatMessage({ userMsg, history, systemPrompt }) {
  const messages = [
    ...history.slice(-8).map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
    { role: 'user', content: userMsg },
  ];

  // 1. Server endpoint (Vercel / Express / etc.)
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 9000);
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg, history }),
      signal: ctrl.signal,
    });
    clearTimeout(timeout);
    if (r.ok) return (await r.json()).reply;
  } catch {
    // Server unavailable — fall through
  }

  // 2. Browser-direct SDK (temporary — to be removed when server is live)
  const client = await getClient();
  if (client) {
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 450,
      system: systemPrompt,
      messages,
    });
    return resp.content[0].text;
  }

  // 3. No AI available
  return null;
}
