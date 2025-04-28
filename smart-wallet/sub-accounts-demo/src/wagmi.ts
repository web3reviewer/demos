import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [baseSepolia, base],
    connectors: [
      coinbaseWallet({
        appName: "My Sub Account Demo",
        preference: {
          keysUrl: "https://keys-dev.coinbase.com/connect",
          options: "smartWalletOnly",
        },
        subAccounts: {
          enableAutoSubAccounts: true,
          defaultSpendLimits: {
            8453: [
              {
                token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                allowance: "0x2386f26fc10000",
                period: 86400,
              },
            ],
          },
        },
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
      [base.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
