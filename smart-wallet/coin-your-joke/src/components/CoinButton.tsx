import { CreateCoinArgs } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAccount, useWriteContract } from "wagmi";
import { COIN_FACTORY_ADDRESS, coinFactoryAbi } from "@/constants";

interface CoinButtonProps {
  coinParams: CreateCoinArgs;
  onError: (error: string) => void;
  onTxHash: (hash: string) => void;
}

export function CoinButton({ coinParams, onError, onTxHash }: CoinButtonProps) {
  const { address } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const handleCreateCoin = async () => {
    if (!address) {
      onError("Please connect your wallet first");
      return;
    }

    try {
      const result = await writeContract({
        abi: coinFactoryAbi,
        address: COIN_FACTORY_ADDRESS,
        functionName: 'createCoin',
        args: [
          coinParams.name,
          coinParams.symbol,
          coinParams.uri,
          coinParams.payoutRecipient,
          coinParams.initialPurchaseWei
        ]
      });

      if (result) {
        onTxHash(result);
        toast.success("Transaction submitted!");
      }
    } catch (error) {
      console.error('Error creating coin:', error);
      onError(error instanceof Error ? error.message : 'Failed to create coin');
      toast.error("Failed to create coin");
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
