import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Coins, Wallet, Copy } from "lucide-react";
import { toast } from "sonner";

const formatAddress = (address: string | undefined) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const Header = () => {
  const account = useAccount();
  const { connectors, connect, error } = useConnect();
  const { disconnect } = useDisconnect();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <Coins className="h-8 w-8 text-[#1453EE]" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1453EE] to-[#1453EE]/80 bg-clip-text text-transparent">
          Coin Your Bangers
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        {account.status === "connected" ? (
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-white rounded-full flex items-center gap-2 border border-[#1453EE] shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#1453EE]"></div>
              <span className="text-xs font-medium text-[#1453EE]">
                {formatAddress(account.address)}
              </span>
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
  );
}; 