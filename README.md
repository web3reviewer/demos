# Hangman Onchain

A decentralized twist of the classic Hangman word game built on Base, featuring onchain rewards gasless transactions and playable as a [MiniApp]!

## Live Demo

- 🎮 [Play the Game](https://onchain-hangman-ruddy.vercel.app/)
- 📝 [View Smart Contract](https://sepolia.basescan.org/address/0x352d55dd643ec049191d133a146be3086e0e1b85#code)

## Features

- **Onchain Gameplay**: Play the classic word-guessing game with blockchain integration
- **Gasless Transactions**: Powered by Coinbase Developer Platform's Paymaster service
- **Availabe as a MiniApp**: Play this in the Base Wallet or on Farcaster!
- **Multiple Categories**: Choose from various word categories to play
- **Onchain Rewards**: Win and claim rewards directly on the blockchain
- **Smart Contract Integration**: Built with Solidity and deployed on Base network
- **Modern UI**: Built with Next.js 14 and [MiniKit]
- **Server Wallet**: Server wallet handles reward management and disbursements

## Game Flow

1. Connect your wallet (supports Base network)
2. Pay a small entry fee (currently 0.0001 ETH)
3. Select a word category
4. Play the game with 3 attempts per word
5. Win and get your victory recorded onchain
6. Claim your rewards at any time

## 🛠️ Tech Stack

- **Frontend**:

  - Next.js 14 (App Router)
  - TypeScript
  - TailwindCSS
  - OnchainKit / MiniKit
  - Wagmi v2
  - Viem v2

- **Blockchain**:
  - Support for Base mainnet and Base Sepolia
  - Foundry for Smart Contracts
  - Coinbase Developer Platform:
    - [Paymaster]
    - [Wallet v2] API
    - [Node]

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Base compatible wallet (Coinbase Wallet, MetaMask, etc.)
- At least .0001 ETH on Base Sepolia

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd hangman-onchain
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with the following variables:

```env
CDP_API_KEY_ID=your_cdp_api_key_id
CDP_API_KEY_SECRET=your_cdp_api_key_secret
CDP_WALLET_SECRET=your_cdp_wallet_secret
CDP_SIGNER_ADDRESS=your_cdp_signer_address
GAME_CONTRACT_ADDRESS_SEPOLIA=your_game_contract_address
```

4. Start the development server:

```bash
npm run dev
```

## 📝 Smart Contract

The game uses a smart contract deployed on Base network that handles:

- Game entry fees
- Reward distribution
- Win recording
- Owner controls for fee management

### Contract Addresses

- Base Sepolia: [0x352d55dd643ec049191d133a146be3086e0e1b85](https://sepolia.basescan.org/address/0x352d55dd643ec049191d133a146be3086e0e1b85#code)

### Contract Functions

- `startGame(bool payWithETH)`: Start a new game
- `recordReward(address player, bool isETH)`: Record a player's win
- `setEntryFee(bool isETH, uint256 newFee)`: Update entry fees (owner only)
- `setEthPayoutAmount(uint256 newAmount)`: Update ETH rewards (owner only)
- `setUsdcPayoutAmount(uint256 newAmount)`: Update USDC rewards (owner only)

## 🔄 Deploying Your Own Version

1. The smart contract is verified on Base network
2. Deploy using Foundry or Remix
3. Update the contract address in your environment variables
4. Change the owner address to your server wallet address to use `onlyOwner` functions

## 📜 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Onchain Win Recording

When a user wins, their address is recorded onchain via the `/api/win` endpoint using a Coinbase CDP account. See `RrcordOnchainSteps.md` for details. You must set the following in your `.env.local`:

- CDP_API_KEY_ID
- CDP_API_KEY_SECRET
- CDP_WALLET_SECRET
- CDP_SIGNER_ADDRESS
- GAME_CONTRACT_ADDRESS_SEPOLIA

---

[MiniKit]: https://docs.base.org/builderkits/minikit/overview
[MiniApp]: https://miniapps.farcaster.xyz/
[Node]: https://portal.cdp.coinbase.com/products/node
[Wallet v2]: https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome
[Paymaster]: https://docs.cdp.coinbase.com/paymaster/docs/paymaster-bundler-qs-ui
