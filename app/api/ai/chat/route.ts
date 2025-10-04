import OpenAI from 'openai';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, system, max_tokens = 500, temperature = 0.3 } = body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages is required' }), { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const formatted = system
      ? [{ role: 'system', content: system }, ...messages]
      : messages;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: formatted as any,
      max_tokens,
      temperature,
    });

    const text = completion.choices[0]?.message?.content || '';

    return new Response(
      JSON.stringify({ text }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('API /api/ai/chat error:', err);
    return new Response(JSON.stringify({ error: err?.message || 'Unknown error' }), { status: 500 });
  }
}


