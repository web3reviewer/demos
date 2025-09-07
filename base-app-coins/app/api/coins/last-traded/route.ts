import { NextRequest } from 'next/server';
import { getCoinsLastTraded } from '@zoralabs/coins-sdk';

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.ZORA_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing ZORA_API_KEY env var' }, null, 2), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const { searchParams } = new URL(req.url);
    const first = searchParams.get('first');
    const after = searchParams.get('after');

    const response = await getCoinsLastTraded({ first: first ? Number(first) : undefined, after: after || undefined });

    return new Response(JSON.stringify(response, null, 2), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message || 'Internal Server Error' }, null, 2), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
