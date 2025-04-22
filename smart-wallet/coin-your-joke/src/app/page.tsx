"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { CoinButton, CreateCoinArgs } from "@/app/components/CoinButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Wallet, Coins, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const emptyCoinArgs: CreateCoinArgs = {
  name: "name",
  symbol: "symbol",
  uri: "uri",
  payoutRecipient: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  initialPurchaseWei: BigInt(10000000000000000), // 0.01 ETH
}

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
        initialPurchaseWei: BigInt(10000000000000000) // Exactly 0.01 ETH
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
    <div className="min-h-screen bg-hero-light dark:bg-hero-dark">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Coins className="h-8 w-8 text-brand" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand to-brand/80 bg-clip-text text-transparent">Joke Coin Creator</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {account.status === "connected" ? (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full flex items-center gap-2 border border-border shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium">{formatAddress(account.address)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5" 
                    onClick={() => account.address && copyToClipboard(account.address)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => disconnect()}
                  className="text-xs"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                {connectors.map((connector) => (
                  <Button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    variant="brand"
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <Wallet className="h-4 w-4" />
                    {connector.name}
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
              <Card className="border-border shadow-sm hover-scale">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Step 1: Enter Your Joke</CardTitle>
                  <CardDescription>
                    The funnier the joke, the better the coin!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={joke}
                    onChange={(e) => setJoke(e.target.value)}
                    placeholder="Why don't scientists trust atoms? Because they make up everything..."
                    className="min-h-32 resize-none"
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => generateCoinParams(joke)}
                    disabled={!joke || loading}
                    variant="gradient"
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Joke...
                      </>
                    ) : 'Generate Coin'}
                  </Button>
                </CardFooter>
              </Card>

              {apiError && (
                <Alert variant="destructive" className="border border-red-200 bg-red-50/50 dark:bg-red-900/10 slide-in-from-top animate-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}

              {coinParams.name !== emptyCoinArgs.name && (
                <Card className="border-border shadow-sm hover-scale">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Step 2: Review Coin Details</CardTitle>
                    <CardDescription>
                      Your joke has been transformed into a unique coin
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-brand to-brand/80 flex items-center justify-center text-brand-foreground text-2xl font-bold shadow-md">
                          {coinParams.symbol}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-background/80 backdrop-blur-sm p-3">
                          <p className="text-xs text-muted-foreground mb-1">Name</p>
                          <p className="font-medium">{coinParams.name}</p>
                        </div>
                        <div className="rounded-lg bg-background/80 backdrop-blur-sm p-3">
                          <p className="text-xs text-muted-foreground mb-1">Symbol</p>
                          <p className="font-medium">{coinParams.symbol}</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-background/80 backdrop-blur-sm p-3">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground mb-1">Metadata URI</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5" 
                            onClick={() => copyToClipboard(coinParams.uri)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{coinParams.uri}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {coinParams.name !== emptyCoinArgs.name && (
                <div className="px-4 py-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border shadow-sm">
                  <p className="text-sm font-medium text-center mb-3">Step 3: Deploy Your Coin</p>
                  <CoinButton
                    {...coinParams}
                    onSuccess={handleSuccess}
                    onError={(e) => setApiError(e.message)}
                  />
                </div>
              )}

              {success && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      Congratulations! Your coin is now live
                    </CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-400">
                      Your joke has been immortalized on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-white dark:bg-slate-800 p-3 flex flex-col gap-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Transaction Hash</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-100 dark:bg-slate-700 p-2 rounded flex-1 overflow-auto">{txHash}</code>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(txHash)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => window.open(getEtherscanLink(txHash), '_blank')}
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
                      className="w-full"
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
              <Coins className="h-16 w-16 text-brand mb-4" />
              <h2 className="text-2xl font-bold text-center mb-2">Create Your Own Joke Coin</h2>
              <p className="text-center text-muted-foreground max-w-md mb-6">
                Turn your jokes into cryptocurrency tokens on Base blockchain. Connect your wallet to get started.
              </p>
              <div className="flex gap-3">
                {connectors.map((connector) => (
                  <Button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    variant="gradient"
                    size="xl"
                    className="flex items-center gap-2"
                  >
                    <Wallet className="h-5 w-5" />
                    Connect with {connector.name}
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
