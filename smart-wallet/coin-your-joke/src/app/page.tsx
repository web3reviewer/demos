"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { CoinButton, CreateCoinArgs } from "@/app/components/CoinButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Wallet, Coins, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const emptyCoinArgs: CreateCoinArgs = {
  name: "name",
  symbol: "symbol",
  uri: "uri",
  payoutRecipient: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  initialPurchaseWei: BigInt(1), // 0.01 ETH
}

const MAX_JOKE_LENGTH = 400;

function App() {
  const account = useAccount();
  const { connectors, connect, error } = useConnect();
  const { disconnect } = useDisconnect();

  const [joke, setJoke] = useState<string>('');
  const [coinParams, setCoinParams] = useState<CreateCoinArgs>(emptyCoinArgs);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');

  const handleJokeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Remove any newlines and limit length
    const singleLineValue = value.replace(/\n/g, '');
    if (singleLineValue.length <= MAX_JOKE_LENGTH) {
      setJoke(singleLineValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent Enter key from creating new lines
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // Generate coin parameters from joke
  const generateCoinParams = async (jokeText: string) => {
    if (!jokeText) return;
    setLoading(true);
    setApiError('');
    
    try {
      const response = await fetch('/api/generate-coin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ joke: jokeText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate coin parameters');
      }
      
      const data = await response.json();
      
      // Make sure the metadataUrl is absolute
      let metadataUrl = data.metadataUrl;
      if (metadataUrl.startsWith('/') && typeof window !== 'undefined') {
        metadataUrl = window.location.origin + metadataUrl;
      }
      
      setCoinParams({
        name: data.name,
        symbol: data.symbol,
        uri: metadataUrl,
        payoutRecipient: account.address || emptyCoinArgs.payoutRecipient,
        initialPurchaseWei: BigInt(0) // Exactly 0.01 ETH
      });
      
      toast.success("Generated coin parameters successfully!");
      
    } catch (e) {
      setApiError(`Error: ${(e as Error).message}`);
      toast.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (hash: string) => {
    setSuccess(true);
    setTxHash(hash);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getEtherscanLink = (hash: string) => {
    return `https://basescan.org/tx/${hash}`;
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Coins className="h-8 w-8 text-[#1453EE]" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1453EE] to-[#1453EE]/80 bg-clip-text text-transparent">Coin Your Bangers</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {account.status === "connected" ? (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-white rounded-full flex items-center gap-2 border border-[#1453EE] shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#1453EE]"></div>
                  <span className="text-xs font-medium text-[#1453EE]">{formatAddress(account.address)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 text-[#1453EE]" 
                    onClick={() => account.address && copyToClipboard(account.address)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => disconnect()}
                  className="text-xs text-[#1453EE] border-[#1453EE] hover:bg-[#1453EE] hover:text-white"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                {connectors.filter(connector => connector.name === 'Coinbase Wallet').map((connector) => (
                  <Button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    variant="gradient"
                    size="sm"
                    className="flex items-center gap-1.5 bg-[#1453EE] hover:bg-[#1453EE]/90 text-white"
                  >
                    <Wallet className="h-4 w-4" />
                    Sign In
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6 slide-in-from-top animate-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {account.status === "connected" ? (
            <>
              <Card className="border-[#1453EE] shadow-sm hover-scale">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-[#1453EE]">Turn Your Banger into a Coin</CardTitle>
                  <CardDescription className="text-[#1453EE]/80">
                    Enter your joke and coin it! (Max {MAX_JOKE_LENGTH} characters)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <textarea
                      value={joke}
                      onChange={handleJokeChange}
                      onKeyDown={handleKeyDown}
                      placeholder="We can clone a wolf that's been dead for 13,000 years but we still have to approve the same token to swap it on each individual L2"
                      className="w-full px-3 py-2 border border-[#1453EE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1453EE] min-h-[100px] resize-none"
                      rows={1}
                    />
                    <div className="text-right text-sm text-[#1453EE]/80">
                      {joke.length}/{MAX_JOKE_LENGTH} characters
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => generateCoinParams(joke)}
                    disabled={!joke || loading}
                    className="w-full bg-[#1453EE] hover:bg-[#1453EE]/90 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating your coin...
                      </>
                    ) : 'Coin it!'}
                  </Button>
                </CardFooter>
              </Card>

              {apiError && (
                <Alert variant="destructive" className="border border-red-200 bg-red-50/50 slide-in-from-top animate-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}

              {coinParams.name !== emptyCoinArgs.name && (
                <Card className="border-[#1453EE] shadow-sm hover-scale">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-[#1453EE]">Your Coin Details</CardTitle>
                    <CardDescription className="text-[#1453EE]/80">
                      Review your coin details before minting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#1453EE] to-[#1453EE]/80 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                          {coinParams.symbol}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-[#1453EE]/80 mb-1">Name</p>
                          <p className="font-medium text-[#1453EE]">{coinParams.name}</p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-[#1453EE]/80 mb-1">Symbol</p>
                          <p className="font-medium text-[#1453EE]">{coinParams.symbol}</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-[#1453EE]/80 mb-1">Metadata URI</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 text-[#1453EE]" 
                            onClick={() => copyToClipboard(coinParams.uri)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-[#1453EE]/80 truncate">{coinParams.uri}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <CoinButton
                      {...coinParams}
                      onSuccess={handleSuccess}
                      onError={(e) => setApiError(e.message)}
                      className="w-full bg-[#1453EE] hover:bg-[#1453EE]/90 text-white"
                    />
                  </CardFooter>
                </Card>
              )}

              {success && (
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
                        setJoke('');
                        setCoinParams(emptyCoinArgs);
                        setSuccess(false);
                        setTxHash('');
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
              <div className="flex gap-3">
                {connectors.filter(connector => connector.name === 'Coinbase Wallet').map((connector) => (
                  <Button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    variant="gradient"
                    size="xl"
                    className="flex items-center gap-2 bg-[#1453EE] hover:bg-[#1453EE]/90 text-white"
                  >
                    <Wallet className="h-5 w-5" />
                    Sign In
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
