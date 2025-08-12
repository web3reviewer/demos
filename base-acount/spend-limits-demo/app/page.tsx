"use client";

import {
  ConnectWallet,
  ConnectWalletText,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import ImageSvg from "./svg/Image";
import OnchainkitSvg from "./svg/OnchainKit";
import Subscribe from "@/components/Subscribe";
import { useAccount } from "wagmi";

export default function App() {
  const account = useAccount();
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="absolute top-4 right-4">
        <div className="flex justify-end">
          <div className="wallet-container">
            {account?.address && (
              <Wallet>
                <ConnectWallet>
                  <ConnectWalletText>Sign up / log in</ConnectWalletText>
                  <Avatar className="h-6 w-6" />
                  <Name className="text-white" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownLink
                    icon="wallet"
                    href="https://keys.coinbase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Wallet
                  </WalletDropdownLink>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center space-y-20">
        <div className="max-w-2xl w-full p-4 flex flex-col items-center absolute top-4">
          <div className="w-1/6 mx-auto">
            <ImageSvg />
          </div>
          <a target="_blank" rel="_template" href="https://onchainkit.xyz">
            <OnchainkitSvg className="text-white w-2/3 mx-auto" />
          </a>
        </div>
        <Subscribe />
      </main>
    </div>
  );
}
