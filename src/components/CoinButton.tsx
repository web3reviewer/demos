import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';
import { zoraNftCreatorV1Config } from "@zoralabs/coins-sdk";
import { useState } from "react";

interface CoinButtonProps {
  name: string;
  symbol: string;
  uri: string;
  payoutRecipient: `0x${string}`;
  initialPurchaseWei: bigint;
  onTxHash: (hash: string) => void;
}

export function CoinButton({ 
  name, 
  symbol, 
  uri, 
  payoutRecipient, 
  initialPurchaseWei,
  onTxHash 
}: CoinButtonProps) {
  const { address, connector } = useAccount();
  const [isPending, setIsPending] = useState(false);

  const handleCreateCoin = async () => {
    if (!address || !connector) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsPending(true);

    try {
      const publicClient = createPublicClient({
        chain: base,
        transport: http()
      });

      const walletClient = createWalletClient({
        chain: base,
        transport: custom(await connector.getProvider())
      });

      const { contractAddress, setupActions } = await zoraNftCreatorV1Config.getContractParameters({
        chainId: base.id,
        contractName: name,
        contractSymbol: symbol,
        defaultAdmin: address,
        editionSize: 1n,
        royaltyBPS: 0,
        fundsRecipient: payoutRecipient,
        publicSalePrice: initialPurchaseWei,
        metadataURI: uri,
        publicClient
      });

      const txHash = await setupActions.deploy({ walletClient });
      
      onTxHash(txHash);
      toast.success("Transaction submitted!");
    } catch (error) {
      console.error('Error creating coin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create coin');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="border-[#1453EE]/20">
      <CardHeader>
        <CardTitle className="text-[#1453EE]">Create Your Coin</CardTitle>
        <CardDescription className="text-[#1453EE]/80">
          Ready to immortalize your joke on the blockchain?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full bg-[#1453EE] hover:bg-[#1453EE]/90 text-white"
          onClick={handleCreateCoin}
          disabled={!address || isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Coin...
            </>
          ) : (
            'Create Coin'
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 