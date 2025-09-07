import { NextRequest } from 'next/server';
import { getProfile } from '@zoralabs/coins-sdk';

type ProfileData = {
  profile?: {
    id?: string;
    handle?: string;
    displayName?: string;
    bio?: string;
    username?: string;
    website?: string;
    avatar?: {
      small?: string;
      medium?: string;
      blurhash?: string;
    };
    publicWallet?: {
      walletAddress?: string;
    };
    socialAccounts?: {
      instagram?: { username?: string; displayName?: string };
      tiktok?: { username?: string; displayName?: string };
      twitter?: { username?: string; displayName?: string };
      farcaster?: { username?: string; displayName?: string };
    };
    linkedWallets?: {
      edges?: Array<{
        node?: {
          walletType?: 'PRIVY' | 'EXTERNAL' | 'SMART_WALLET';
          walletAddress?: string;
        };
      }>;
    };
    creatorCoin?: {
      address?: string;
      marketCap?: string;
      marketCapDelta24h?: string;
    };
  };
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get('identifier');
    if (!identifier) {
      return new Response(JSON.stringify({ error: 'Missing identifier' }, null, 2), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const apiKey = process.env.ZORA_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing ZORA_API_KEY env var' }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await getProfile({ identifier });
    const p: any = response?.data?.profile;
    const profileData: ProfileData = {
      profile: p
        ? {
            id: p?.id,
            handle: p?.handle,
            displayName: p?.displayName,
            bio: p?.bio,
            username: p?.username,
            website: p?.website,
            avatar: {
              small: p?.avatar?.small,
              medium: p?.avatar?.medium,
              blurhash: p?.avatar?.blurhash
            },
            publicWallet: {
              walletAddress: p?.publicWallet?.walletAddress
            },
            socialAccounts: {
              instagram: {
                username: p?.socialAccounts?.instagram?.username,
                displayName: p?.socialAccounts?.instagram?.displayName
              },
              tiktok: {
                username: p?.socialAccounts?.tiktok?.username,
                displayName: p?.socialAccounts?.tiktok?.displayName
              },
              twitter: {
                username: p?.socialAccounts?.twitter?.username,
                displayName: p?.socialAccounts?.twitter?.displayName
              },
              farcaster: {
                username: p?.socialAccounts?.farcaster?.username,
                displayName: p?.socialAccounts?.farcaster?.displayName
              }
            },
            linkedWallets: {
              edges: p?.linkedWallets?.edges?.map((e: any) => ({
                node: {
                  walletType: e?.node?.walletType,
                  walletAddress: e?.node?.walletAddress
                }
              }))
            },
            creatorCoin: {
              address: p?.creatorCoin?.address,
              marketCap: p?.creatorCoin?.marketCap,
              marketCapDelta24h: p?.creatorCoin?.marketCapDelta24h
            }
          }
        : undefined
    };

    return new Response(JSON.stringify({ identifier, ...profileData }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message || 'Internal Server Error' }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
