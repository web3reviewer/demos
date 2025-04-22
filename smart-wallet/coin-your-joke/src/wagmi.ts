import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export const cbWalletConnector = coinbaseWallet({
  appName: "Smart Wallet Zora Coiner",
  preference: "smartWalletOnly",
});

export function getConfig() {
  return createConfig({
    chains: [base, baseSepolia],
    connectors: [cbWalletConnector],
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
