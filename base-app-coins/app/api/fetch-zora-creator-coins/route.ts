import { NextRequest } from 'next/server';
import { publicClient } from '@/chain';
import { UniswapV4ABI, UniswapV4PoolManager } from '@/univ4';
import { loadData } from '@/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latestChainBlock = await publicClient.getBlockNumber();

    const fromParam = searchParams.get('from') ?? searchParams.get('fromBlock');
    const toParam = searchParams.get('to') ?? searchParams.get('toBlock');
    const windowParam = searchParams.get('window');
    const envWindow = process.env.BLOCK_WINDOW;

    let fromBlock: bigint | null = null;
    let toBlock: bigint | null = null;
    let range: bigint = 0n;

    if (fromParam && toParam) {
      try {
        fromBlock = BigInt(fromParam);
        toBlock = BigInt(toParam);
      } catch (_) {
        return new Response(JSON.stringify({ error: 'Invalid from/to block values' }, null, 2), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      if (toBlock < fromBlock) {
        // swap to ensure correct order
        const tmp = toBlock;
        toBlock = fromBlock;
        fromBlock = tmp;
      }
      range = toBlock - fromBlock;
    } else {
      const windowSize = BigInt(windowParam ?? envWindow ?? '1000');
      range = windowSize > 0n ? windowSize - 1n : 0n;
      toBlock = latestChainBlock;
      fromBlock = toBlock > range ? toBlock - range : 0n;
    }

    const logs = await publicClient.getContractEvents({
      abi: UniswapV4ABI,
      address: UniswapV4PoolManager,
      fromBlock: fromBlock,
      toBlock: toBlock,
      eventName: 'Initialize',
    });

    const poolKeys = logs.map((log) => ({
      currency0: log.args.currency0 as string,
      currency1: log.args.currency1 as string,
      fee: log.args.fee as number,
      tickSpacing: log.args.tickSpacing as number,
      hooks: log.args.hooks as string,
    }));

    const results = [];
    for (const key of poolKeys) {
      let coinType;
      if (key.hooks === '0xd61A675F8a0c67A73DC3B54FB7318B4D91409040') {
        coinType = 'ZORA_CREATOR_COIN';
      }
      if (coinType !== 'ZORA_CREATOR_COIN') continue;

      const pool = await loadData(key);
      const name = pool.currency1.name;
      const symbol = pool.currency1.symbol;
      const address = pool.currency1.wrapped.address;
      results.push({ name, symbol, address });
    }

    const payload = {
      status: 'ok',
      window: {
        size: (range + 1n) + '',
        fromBlock: fromBlock + '',
        toBlock: toBlock + ''
      },
      count: results.length,
      coins: results
    };

    return new Response(JSON.stringify(payload, null, 2), {
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
