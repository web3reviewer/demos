import { parseEther } from "viem";
import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { toHex } from "viem";

export const cbWalletConnector = coinbaseWallet({
  appName: "Coin Your Bangers",
  preference: {
    keysUrl: "https://keys-dev.coinbase.com/connect",
    options: "smartWalletOnly",
  },
  subAccounts: {
    enableAutoSubAccounts: true,
    defaultSpendLimits: {
      84532: [ // Base Sepolia Chain ID
        {
          token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          allowance: toHex(parseEther('0.01')), // 0.01 ETH
          period: 86400, // 24h
        },
      ],
    },
  },
});

export function getConfig() {
  return createConfig({
    chains: [baseSepolia],
    connectors: [cbWalletConnector],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
