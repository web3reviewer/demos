"use client";

import { useState } from "react";
import { Coins, CheckCircle, AlertCircle, ExternalLink, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { WalletConnect } from "@/components/WalletConnect";
import { CoinDetails } from "@/components/CoinDetails";
import { JokeInput } from "@/components/JokeInput";
import { useAccount } from "wagmi";
import { CreateCoinArgs } from "@/types";
import { CoinButton } from "@/components/CoinButton";
import Image from 'next/image';

const emptyCoinArgs: CreateCoinArgs = {
  name: "name",
  symbol: "symbol",
  uri: "uri",
  payoutRecipient: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  initialPurchaseWei: BigInt(1), // 0.01 ETH
}

const MAX_JOKE_LENGTH = 400;

function App() {
  const { status: accountStatus } = useAccount();
  const [coinParams, setCoinParams] = useState<CreateCoinArgs | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleJokeGenerated = (params: CreateCoinArgs) => {
    setCoinParams(params);
    setApiError(null);
  };

  const handleError = (errorMessage: string) => {
    setApiError(errorMessage);
    setCoinParams(null);
  };

  const handleTxHash = (hash: string) => {
    setTxHash(hash);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getEtherscanLink = (hash: string) => {
    return `https://basescan.org/tx/${hash}`;
  };

  return (
    <main className="min-h-screen relative">
      <Image
        src="/hero-bg.svg"
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Coins className="h-8 w-8 text-[#1453EE]" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1453EE] to-[#1453EE]/80 bg-clip-text text-transparent">
              Coin Your Bangers
            </h1>
          </div>
          <WalletConnect />
        </div>
        
        {apiError && (
          <Alert variant="destructive" className="mb-6 slide-in-from-top animate-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {accountStatus === "connected" ? (
            <>
              <JokeInput onJokeGenerated={handleJokeGenerated} />

              {coinParams && (
                <>
                  <CoinDetails coinParams={coinParams} />
                  <CoinButton
                    coinParams={coinParams}
                    onError={handleError}
                    onTxHash={handleTxHash}
                  />
                </>
              )}

              {txHash && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Congratulations! Your coin is now live
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Your joke has been immortalized on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-white p-3 flex flex-col gap-2">
                      <p className="text-xs text-slate-500">Transaction Hash</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-100 p-2 rounded flex-1 overflow-auto">{txHash}</code>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(txHash)} className="text-[#1453EE]">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => window.open(getEtherscanLink(txHash), '_blank')}
                            className="text-[#1453EE]"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full text-[#1453EE] border-[#1453EE] hover:bg-[#1453EE] hover:text-white"
                      onClick={() => {
                        setCoinParams(null);
                        setTxHash(null);
                      }}
                    >
                      Create Another Coin
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center">
              <Coins className="h-16 w-16 text-[#1453EE] mb-4" />
              <h2 className="text-2xl font-bold text-center mb-2 text-[#1453EE]">Coin your bangers!</h2>
              <p className="text-center text-[#1453EE]/80 max-w-md mb-6">
                Never let a banger go to waste. Coin it! 
                <br />
                Connect your wallet to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
