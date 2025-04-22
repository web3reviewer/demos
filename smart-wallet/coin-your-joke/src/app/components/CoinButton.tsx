import { useEffect, useState } from "react";
import type { Address, Abi } from "viem";
import {
  useWriteContract,
  useSimulateContract,
  useAccount,
} from "wagmi";
import { createCoinCall } from "@zoralabs/coins-sdk";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Coins } from "lucide-react";
import { toast } from "sonner";

type ContractParams = {
  address: Address;
  abi: Abi;
  functionName: string;
  args: readonly unknown[] | unknown[];
  value?: bigint;
};

export type CreateCoinArgs = {
  name: string;
  symbol: string;
  uri: string;
  payoutRecipient: `0x${string}`;
  initialPurchaseWei?: bigint;
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
  className?: string;
};

export function CoinButton({
  name,
  symbol,
  uri,
  payoutRecipient,
  initialPurchaseWei = BigInt(0),
  onSuccess,
  onError,
  className
}: CreateCoinArgs) {
  const account = useAccount();
  const [status, setStatus] = useState<string>('idle');
  const [contractParams, setContractParams] = useState<ContractParams | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { writeContractAsync } = useWriteContract();

  // Create the contract call params
  useEffect(() => {
    const fetchContractParams = async () => {
      try {
        const params = await createCoinCall({
          name,
          symbol,
          uri,
          payoutRecipient,
          initialPurchaseWei: initialPurchaseWei || BigInt(0), // 0.01 ETH
          platformReferrer: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        });
        
        // Extract only the parameters we need
        setContractParams({
          address: params.address,
          abi: params.abi,
          functionName: params.functionName,
          args: params.args,
          value: params.value
        });
      } catch (error) {
        console.error("Error creating coin call params:", error);
        onError?.(error as Error);
      }
    };

    fetchContractParams();
  }, [name, symbol, uri, payoutRecipient, initialPurchaseWei, onError]);

  // Simulate the contract call
  const { data: simulateData, error: simulateError } = useSimulateContract(
    contractParams ? {
      address: contractParams.address,
      abi: contractParams.abi,
      functionName: contractParams.functionName,
      args: contractParams.args,
      value: contractParams.value
    } : undefined
  );

  // Set up the write contract function
  const { writeContract, data: hash, error: writeError } = useWriteContract();

  // Create the coin
  const handleClick = async () => {
    if (!contractParams) return;
    
    try {
      setIsLoading(true);
      const hash = await writeContractAsync(contractParams);
      onSuccess?.(hash);
      toast.success("Coin created successfully!");
    } catch (error) {
      onError?.(error as Error);
      toast.error("Failed to create coin");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle transaction status
  useEffect(() => {
    if (hash) {
      setStatus('success');
      onSuccess?.(hash);
      toast.success("Coin created successfully!");
    }
    if (writeError) {
      setStatus('error');
      onError?.(writeError);
      toast.error(`Error: ${writeError.message}`);
    }
  }, [hash, writeError, onSuccess, onError]);

  // Format the ETH value for display
  const formatEthValue = (wei: bigint | undefined) => {
    if (!wei) return "0.01 ETH";
    return `${Number(wei) / 1e18} ETH`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Coins className="h-4 w-4 text-brand" />
          <span>Initial cost: {formatEthValue(initialPurchaseWei)}</span>
        </div>
        
        {simulateError && (
          <div className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Simulation failed
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleClick}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? "Deploying..." : "Deploy Coin"}
      </Button>
      
      {simulateError && (
        <Alert variant="destructive" className="mt-4 border border-red-200 bg-red-50/50 dark:bg-red-900/10 slide-in-from-top animate-in">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Simulation Error</AlertTitle>
          <AlertDescription className="text-sm">
            {simulateError.message}
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert variant="destructive" className="mt-4 border border-red-200 bg-red-50/50 dark:bg-red-900/10 slide-in-from-top animate-in">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Transaction Failed</AlertTitle>
          <AlertDescription className="text-sm">
            {writeError?.message}
          </AlertDescription>
        </Alert>
      )}

      {status === 'success' && (
        <Alert className="mt-4 border border-green-200 bg-green-50/50 dark:bg-green-900/10 slide-in-from-top animate-in">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription className="text-sm">
            Your coin has been created successfully.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
