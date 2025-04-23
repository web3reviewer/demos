const environment=process.env.ENV

export const PROJECT_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export const COIN_FACTORY_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;

export const coinFactoryAbi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string"
      },
      {
        internalType: "string",
        name: "uri",
        type: "string"
      },
      {
        internalType: "address",
        name: "payoutRecipient",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "initialPurchaseWei",
        type: "uint256"
      }
    ],
    name: "createCoin",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
] as const;