import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { JokeInput } from "./JokeInput";
import { CoinDetails } from "./CoinDetails";
import { CoinButton } from "./CoinButton";
import { CreateCoinArgs } from "@/types";

interface CoinCreationFlowProps {
  onSuccess: (hash: string) => void;
}

export function CoinCreationFlow({ onSuccess }: CoinCreationFlowProps) {
  const [coinParams, setCoinParams] = useState<CreateCoinArgs | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleJokeGenerated = (params: CreateCoinArgs) => {
    setCoinParams(params);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleTxHash = (hash: string) => {
    onSuccess(hash);
  };

  return (
    <div className="space-y-6">
      <JokeInput onJokeGenerated={handleJokeGenerated} />

      {error && (
        <Alert variant="destructive" className="mb-6 slide-in-from-top animate-in">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {coinParams && (
        <div className="space-y-8">
          <CoinDetails coinParams={coinParams} />
          <CoinButton
            coinParams={coinParams}
            onError={handleError}
            onTxHash={handleTxHash}
          />
        </div>
      )}
    </div>
  );
} 