import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for demo purposes
const metadataStore: Record<string, any> = {};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Store metadata with hardcoded image URL
    metadataStore[id] = {
      name: data.name,
      symbol: data.symbol,
      description: data.description || "",
      image: "https://i.imgur.com/tdvjX6c.png"
    };
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store metadata' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Return stored metadata or fallback
    if (metadataStore[id]) {
      return NextResponse.json(metadataStore[id]);
    }
    
    return NextResponse.json({
      name: "Joke Coin",
      symbol: "JOKE",
      description: "A coin created from a joke",
      image: "https://i.imgur.com/tdvjX6c.png"
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve metadata' }, { status: 500 });
  }
} 