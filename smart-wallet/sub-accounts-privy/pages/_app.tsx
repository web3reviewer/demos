import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { toHex, parseEther } from "viem";
import {base, baseSepolia} from 'viem/chains';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff2"
          as="font"
          crossOrigin=""
        />

        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/manifest.json" />

        <title>Privy Auth Starter</title>
        <meta name="description" content="Privy Auth Starter" />
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          embeddedWallets: {
            createOnLogin: "all-users",
          },
          externalWallets: {
            coinbaseWallet: {
              config: {
                appName: "Privy Sub Accounts",
                appLogoUrl: "https://example.com/logo.png",
                preference: {
                  keysUrl: "https://keys-dev.coinbase.com/connect",
                  options: "smartWalletOnly",
                },
                // Set up Sub Account support with a signer function
                subAccounts: {
                  enableAutoSubAccounts: false,
                  defaultSpendLimits: {
                    84532: [
                      {
                        token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                        allowance: toHex(parseEther("0.01")), // 0.01 ETH
                        period: 86400, // 24h
                      },
                    ],
                  },
                },
              },
            },
          },
          appearance: {
            walletList: ["coinbase_wallet"],
            showWalletLoginFirst: true,
          },
          defaultChain: baseSepolia,
          supportedChains: [baseSepolia, base],
        }}
      >
        <Component {...pageProps} />
      </PrivyProvider>
    </>
  );
}

export default MyApp;
