
"use client";
 
import { ProviderInterface } from "@coinbase/wallet-sdk";
import { useEffect, useState } from "react";
import { encodeFunctionData, erc20Abi, numberToHex, parseUnits } from "viem";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Wallet, Zap, Mail, MapPin } from "lucide-react";

export default function CheckoutButton() {
  const [provider, setProvider] = useState<ProviderInterface | undefined>(undefined);
  const [dataToRequest, setDataToRequest] = useState({
    email: true,
    address: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
 
  const account = useAccount();
  const { connectors, connect, status } = useConnect();
  const { disconnect } = useDisconnect();
 
  // Initialize provider when account connected
  useEffect(() => {
    async function getProvider() {
      if (account.status === 'connected' && account.connector) {
        const provider = await account.connector.getProvider();
        setProvider(provider);
      }
    }
    getProvider();
  }, [account]);
 
  // Function to get callback URL - replace in production
  function getCallbackURL() {
    return "https://your-ngrok-url.ngrok-free.app/api/data-validation";
  }
 
  // Handle form submission
  async function handleSubmit() {
    try {
      setIsLoading(true);
      setResult(null);
 
      // Build requests array based on checkboxes
      const requests = [];
      if (dataToRequest.email) requests.push({ type: "email", optional: false });
      if (dataToRequest.address) requests.push({ type: "physicalAddress", optional: false });
 
      if (requests.length === 0) {
        setResult({ success: false, error: "Select at least one data type" });
        setIsLoading(false);
        return;
      }
 
      // Request data from wallet
      const response = await provider?.request({
        method: "wallet_sendCalls",
        params: [{
          version: "1.0",
          chainId: numberToHex(84532), // Base Sepolia
          calls: [
              {
                to: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC contract address on Base Sepolia
                data: encodeFunctionData({
                  abi: erc20Abi,
                  functionName: "transfer",
                  args: [
                    "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
                    parseUnits("0.01", 6),
                  ],
                }),
              },
            ], // Simple transfer of 0.01 USDC to the contract
          capabilities: {
            dataCallback: {
              requests: requests,
              callbackURL: getCallbackURL(),
            },
          },
        }],
      });
 
      // Process response
      if (response?.capabilities?.dataCallback) {
        const data = response.capabilities.dataCallback;
        const result = { success: true };
 
        // Extract email if provided
        if (data.email) result.email = data.email;
 
        // Extract address if provided
        if (data.physicalAddress) {
          const addr = data.physicalAddress.physicalAddress;
          result.address = [
            addr.address1,
            addr.address2,
            addr.city,
            addr.state,
            addr.postalCode,
            addr.countryCode
          ].filter(Boolean).join(", ");
        }
 
        setResult(result);
      } else {
        setResult({ success: false, error: "Invalid response" });
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message || "Transaction failed" });
    } finally {
      setIsLoading(false);
    }
  }
 
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Wallet Connection */}
      {account.status !== 'connected' ? (
        <Card className="neon-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="pixel-font text-lg">Sign In</CardTitle>
            <CardDescription>Use your Smart Wallet to get vibes delivered to your home address</CardDescription>
          </CardHeader>
          <CardContent>
            {connectors
              .filter(c => c.name === 'Coinbase Wallet')
              .map(connector => (
                <Button 
                  key={connector.uid} 
                  onClick={() => connect({ connector })}
                  className="w-full pixel-font text-sm bg-primary hover:bg-primary/80 text-primary-foreground"
                  size="lg"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              ))
            }
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Wallet Status */}
          <Card className="neon-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-accent animate-pulse-slow" />
                  <span className="pixel-font text-sm">Wallet Connected</span>
                </div>
                <Button 
                  onClick={disconnect}
                  variant="outline"
                  size="sm"
                  className="pixel-font text-xs"
                >
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="neon-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="pixel-font text-lg">Checkout Information</CardTitle>
              <CardDescription>Select what info to share for delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="email"
                  checked={dataToRequest.email}
                  onCheckedChange={(checked) => 
                    setDataToRequest(prev => ({ ...prev, email: !!checked }))
                  }
                />
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="email" className="pixel-font text-sm cursor-pointer">
                    Email Address
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="address"
                  checked={dataToRequest.address}
                  onCheckedChange={(checked) => 
                    setDataToRequest(prev => ({ ...prev, address: !!checked }))
                  }
                />
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="address" className="pixel-font text-sm cursor-pointer">
                    Physical Address
                  </label>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading || !provider}
                className="w-full pixel-font text-sm bg-accent hover:bg-accent/80 text-accent-foreground"
                size="lg"
              >
                {isLoading ? "Processing..." : "Buy Vibes (0.01 USDC)"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Display */}
          {result && (
            <Card className={`neon-border ${result.success ? 'bg-accent/10' : 'bg-destructive/10'} backdrop-blur-sm`}>
              <CardContent className="pt-6">
                {result.success ? (
                  <div className="space-y-2">
                    <h3 className="pixel-font text-sm text-accent">Purchase Successful! 🎉</h3>
                    {result.email && <p className="text-sm"><strong>Email:</strong> {result.email}</p>}
                    {result.address && <p className="text-sm"><strong>Address:</strong> {result.address}</p>}
                  </div>
                ) : (
                  <div>
                    <h3 className="pixel-font text-sm text-destructive">Error</h3>
                    <p className="text-sm text-muted-foreground">{result.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
