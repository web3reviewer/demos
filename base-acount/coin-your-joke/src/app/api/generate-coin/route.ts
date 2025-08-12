import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import crypto from 'crypto';
import { PROJECT_URL } from '@/constants';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Server-side environment variable
});

export async function POST(request: NextRequest) {
  try {
    const { joke } = await request.json();
    
    if (!joke) {
      return NextResponse.json({ error: 'Joke is required' }, { status: 400 });
    }
    
    const result = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate parameters for a cryptocurrency coin based on the following joke. 
          Return JSON in this format: 
          {
            "name": "short name (max 3 words)",
            "symbol": "ticker symbol (max 5 letters)"
          }`
        },
        { role: "user", content: joke }
      ]
    });

    const content = result.choices[0].message.content;
    let parsedContent;
    
    try {
      parsedContent = JSON.parse(content || '{}');
    } catch (e) {
      parsedContent = {
        name: joke.split(' ').slice(0, 3).join(' ').substring(0, 20) || "Joke Coin",
        symbol: joke.split(' ')
          .filter((w: string) => w)
          .slice(0, 3)
          .map((word: string) => word[0])
          .join('')
          .toUpperCase()
          .substring(0, 5) || "JOKE"
      };
    }

    // Generate unique ID
    const uniqueId = crypto.randomBytes(8).toString('hex');
    
    // Create metadata URL using PROJECT_URL
    const metadataUrl = `${PROJECT_URL}/api/coin-metadata/${uniqueId}`;
    
    // Store metadata
    await fetch(metadataUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: parsedContent.name,
        symbol: parsedContent.symbol,
        description: joke,
      }),
    });
    
    return NextResponse.json({
      name: parsedContent.name,
      symbol: parsedContent.symbol,
      metadataUrl
    });
    
  } catch (error) {
    console.error('Error generating coin parameters:', error);
    return NextResponse.json(
      { error: 'Failed to generate coin parameters' }, 
      { status: 500 }
    );
  }
} 