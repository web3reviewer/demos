import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCoinArgs } from "@/types";

interface CoinDetailsProps {
  coinParams: CreateCoinArgs;
}

export function CoinDetails({ coinParams }: CoinDetailsProps) {
  return (
    <Card className="border-[#1453EE]/20">
      <CardHeader>
        <CardTitle className="text-[#1453EE]">Coin Details</CardTitle>
        <CardDescription className="text-[#1453EE]/80">
          Review your coin details before creating
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1 text-[#1453EE]">Name</h3>
            <p className="text-[#1453EE]/80">{coinParams.name}</p>
          </div>
          <div>
            <h3 className="font-medium mb-1 text-[#1453EE]">Symbol</h3>
            <p className="text-[#1453EE]/80">{coinParams.symbol}</p>
          </div>
          <div>
            <h3 className="font-medium mb-1 text-[#1453EE]">URI</h3>
            <p className="text-[#1453EE]/80 break-all">{coinParams.uri}</p>
          </div>
          <div>
            <h3 className="font-medium mb-1 text-[#1453EE]">Payout Recipient</h3>
            <p className="text-[#1453EE]/80 font-mono">{coinParams.payoutRecipient}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 