"use server";

import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const joke = searchParams.get('joke') || 'Default joke';
  
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: 40,
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontWeight: 'bold' }}>JOKE COIN</h1>
          <div>{joke}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

