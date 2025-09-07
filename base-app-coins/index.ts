import type { PoolKey } from "@uniswap/v4-sdk";
import { publicClient } from "./chain";
import { UniswapV4ABI, UniswapV4PoolManager } from "./univ4";
import { categorizeAppType, loadData } from "./utils";
import { SqrtPriceMath, TickMath } from "@uniswap/v3-sdk";
import { formatUnits } from "viem";


async function main() {
    const latestBlock = await publicClient.getBlockNumber();
    const startBlock = latestBlock > 999n ? latestBlock - 999n : 0n;

    const logs = await publicClient.getContractEvents({
        abi: UniswapV4ABI,
        address: UniswapV4PoolManager,
        fromBlock: startBlock,
        toBlock: latestBlock,
        eventName: "Initialize"
    })

    const poolKeys = logs.map((log) => {
        return {
            currency0: log.args.currency0,
            currency1: log.args.currency1,
            fee: log.args.fee,
            tickSpacing: log.args.tickSpacing,
            hooks: log.args.hooks
        }
    }) as PoolKey[]

    for (const key of poolKeys) {
        const pool = await loadData(key);

        const currency0Price = pool.currency0Price.toSignificant(6);
        const currency1Price = pool.currency1Price.toSignificant(6);

        let coinType: string | undefined;
        if (key.hooks === "0xd61A675F8a0c67A73DC3B54FB7318B4D91409040") {
            coinType = "ZORA_CREATOR_COIN"
        } else if (key.hooks === "0x9ea932730A7787000042e34390B8E435dD839040") {
            coinType = "ZORA_V4_COIN"
        }
        // Only process ZORA_CREATOR_COIN
        if (coinType !== "ZORA_CREATOR_COIN") continue;

        const appType = await categorizeAppType(pool);

        const priceUpper = TickMath.getSqrtRatioAtTick(TickMath.MAX_TICK)
        const priceLower = TickMath.getSqrtRatioAtTick(TickMath.MIN_TICK)


        const amount0 = SqrtPriceMath.getAmount0Delta(pool.sqrtRatioX96, priceUpper, pool.liquidity, true);
        const amount1 = SqrtPriceMath.getAmount1Delta(priceLower, pool.sqrtRatioX96, pool.liquidity, true)

        const amount0HumanReadable = formatUnits(BigInt(amount0.toString()), pool.currency0.decimals);
        const amount1HumanReadable = formatUnits(BigInt(amount1.toString()), pool.currency1.decimals);

        const metadata = {
            id: pool.poolId,
            key: pool.poolKey,
            currency0: {
                name: pool.currency0.name,
                symbol: pool.currency0.symbol,
                decimals: pool.currency0.decimals,
                address: pool.currency0.wrapped.address,
            },
            currency1: {
                name: pool.currency1.name,
                symbol: pool.currency1.symbol,
                decimals: pool.currency1.decimals,
                address: pool.currency1.wrapped.address,
            },
            sqrtPriceX96: pool.sqrtRatioX96.toString(),
            tick: pool.tickCurrent,
            liquidity: pool.liquidity.toString(),
            liquidityCurrency0: amount0.toString(),
            liquidityCurrency1: amount1.toString(),
            liquidityCurrency0HumanReadable: `${amount0HumanReadable} ${pool.currency0.symbol}`,
            liquidityCurrency1HumanReadable: `${amount1HumanReadable} ${pool.currency1.symbol}`,
            currency0Price,
            currency1Price,
            currency0PriceHumanReadable: `1 ${pool.currency0.symbol} = ${currency0Price} ${pool.currency1.symbol}`,
            currency1PriceHumanReadable: `1 ${pool.currency1.symbol} = ${currency1Price} ${pool.currency0.symbol}`,
            coinType,
            appType
        }

        console.log(metadata)
    }
}

main()