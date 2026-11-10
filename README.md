# Hand of Naire

Hand of Naire is a Next.js-based Web3 toolkit dashboard for monitoring blockchain activity, inspecting assets, and performing multi-wallet operations.

## Tools

- **Portfolio** — view portfolio balances, tokens, and address activity history.
- **Wallet Generator** — generate EVM wallets and vanity addresses.
- **Balance Checker** — check balances for multiple addresses.
- **Multisender** — distribute native tokens using one-to-many, many-to-one, or many-to-many modes.
- **RPC Scanner** — test RPC endpoints and compare network latency and status.
- **ERC721 Mint Scanner** — monitor NFT mint events from `Transfer`, ERC1155, and `ConsecutiveTransfer` logs.
- **ERC20 Mint Scanner** — monitor `Transfer` events originating from the zero address.

OpenSea is not displayed in the main navigation menu.

## Supported Networks

The main network selector supports:

- Ethereum
- Base
- Optimism
- Arbitrum One
- Elysium Mainnet (`99901`)
- HyperEVM (`999`)
- BNB Smart Chain
- Robinhood Chain

RPC endpoints, explorers, and Blockscout settings are managed in [`src/services/networkConfig.ts`](src/services/networkConfig.ts). RPC URLs are public configuration values and are not stored in `.env`.

## Requirements

- Node.js 20 or later
- npm

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Environment variables are only needed for secrets or deployment-specific settings. Create a `.env.local` file when needed:

```env
OPENSEA_API_KEY=your_opensea_api_key
```

RPC endpoints are not configured through environment variables. To change an endpoint, edit `NETWORK_CONFIG` in `src/services/networkConfig.ts`.

## Available Commands

```bash
npm run dev      # start the development server
npm run build    # create a production build
npm run start    # start the production server
npm run lint     # run ESLint
```

## Project Structure

```text
src/app/                 Next.js pages and components
src/hooks/               scanner and state logic
src/services/            network, RPC, and explorer configuration
src/lib/                 chain clients and transaction utilities
src/parser/              ABI and mint-function parsers
```

## Security Notes

- Use burner wallets with the multisender tool.
- Never commit or share private keys.
- Blockchain transactions cannot be reversed after submission.
