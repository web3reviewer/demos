# Zora Coin Agent

An AI-powered Next.js application that allows users to buy Zora creator coins through a chat interface using Base Account spend permissions.

## Features

- **Sign in with Base**: Secure authentication using Base Account
- **Spend Permissions**: Set daily spending limits ($20-$100) for the AI agent
- **AI Chat Interface**: Natural language interaction to buy Zora creator coins
- **Server Wallet**: Automatically creates and manages a server wallet using CDP SDK
- **Function Calling**: AI agent can execute transactions on behalf of users

## Architecture

1. **Authentication**: Users sign in with their Base Account
2. **Server Wallet**: A server wallet is created for each user session using CDP SDK
3. **Spend Permissions**: Users grant spending permissions to the server wallet
4. **AI Agent**: OpenAI GPT-4 with function calling capabilities
5. **Zora Integration**: Lookup profiles and purchase creator coins

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required values:
   - `CDP_API_KEY_ID` - Your Coinbase Developer Platform API Key ID
   - `CDP_API_KEY_SECRET` - Your CDP API Key Secret
   - `CDP_WALLET_SECRET` - Your CDP Wallet Secret
   - `OPENAI_API_KEY` - Your OpenAI API Key
   - `ZORA_API_KEY` - Your Zora API Key (optional, prevents rate limiting - get it from [Developer Settings on Zora](https://zora.co/settings/developer))
   
   **Optional for production:**
   - `SESSION_SECRET` - Only needed if implementing proper JWT sessions (generate with `openssl rand -hex 32`)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign In**: Click "Sign in with Base" to connect your wallet
2. **Set Permissions**: Configure your daily spending limit ($20-$100)
3. **Chat**: Start chatting with the AI agent to buy Zora coins

### Example Prompts

- "Buy $25 worth of @username's creator coin"
- "I want to purchase coins for the user 'artistname'"
- "Get me $50 of coins from the profile @creator"

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Base Account with Sign in with Base
- **Wallet Management**: Coinbase Developer Platform (CDP) SDK
- **AI**: OpenAI GPT-4 with Function Calling
- **Blockchain**: Base Network (Ethereum L2)
- **Spend Permissions**: Base Account spend permission system

## API Routes

- `POST /api/auth/verify` - Verify wallet signature and create session
- `POST /api/wallet/create` - Create server wallet for user
- `POST /api/spend-permission/request` - Request spend permission from user
- `POST /api/zora/buy` - Buy Zora creator coin
- `POST /api/chat` - Chat with AI agent

## Security Features

- Server-side signature verification
- Session-based authentication
- Spend permission limits
- Secure server wallet management
- Transaction validation

## Development

To extend this application:

1. **Add more tools**: Extend the OpenAI function definitions in `src/lib/openai.ts`
2. **Improve Zora integration**: Enhance the Zora SDK integration in `src/lib/zora.ts`
3. **Add transaction history**: Store and display purchase history
4. **Enhanced permissions**: Add more granular permission controls

## License

MIT License - see LICENSE file for details.