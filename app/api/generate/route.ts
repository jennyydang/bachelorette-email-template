import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.' },
      { status: 500 }
    );
  }

  const client = new Anthropic();

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    const email = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    return NextResponse.json({ email });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    const isAuthError = errMsg.toLowerCase().includes('auth') || errMsg.toLowerCase().includes('api key');
    const isConnError = errMsg.toLowerCase().includes('connect') || errMsg.toLowerCase().includes('fetch');

    const userMessage = isAuthError
      ? 'Invalid API key — check your ANTHROPIC_API_KEY in .env.local'
      : isConnError
      ? 'Could not reach Anthropic servers — check your internet connection or API key'
      : errMsg;

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
