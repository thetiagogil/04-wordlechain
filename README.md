# Wordlechain

Wordlechain is a blockchain-based version of the classic Wordle game, built for Web3. Players use a custom ERC20 token to make guesses, combining blockchain technology with an interactive web interface.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Security Model](#security-model)
- [Project Setup Instructions](#project-setup-instructions)
- [How It Works](#how-it-works)
- [Potential Features](#potential-features)

## Features

- **Blockchain Integration**: Powered by Wagmi and RainbowKit for wallet connections and Ethereum interactions.
- **Tokenized Gameplay**: Players use a custom ERC20 token, `WordleToken (WTK)`, to participate in the game.
- **Token Transactions**: Token minting, approval and guess payments are handled through OpenZeppelin ERC20 contracts.
- **Dynamic Letter Feedback**: Players receive feedback for each guess after making a transaction, highlighting correct, misplaced and incorrect letters.
- **Admin Updates Words**: Admins can set new words, resetting the game state for all players.
- **Responsive Frontend Design**: Built with Joy UI and optimized for consistent styling across devices.

## Tech Stack

### Smart Contracts

- **Solidity**: Game logic and token management.
- **OpenZeppelin**: ERC20 implementation.
- **Foundry**: Contract testing and deployment.

### Frontend

- **React + Vite**: React interface with Vite development and production builds.
- **TypeScript**: Type safety and maintainability.
- **React Router**: Client-side routing.
- **Wagmi, Viem & RainbowKit**: Wallet connection and contract interactions.
- **TanStack Query**: Async query caching used by Wagmi.
- **Joy UI**: Component library and theme system.
- **Framer Motion**: UI animation.
- **React Toastify**: Contract and game notifications.

### Script Management

- **Node.js**: Automation for contract deployments and local development.
- **dotenv**: Environment variable loading.
- **Anvil & Sepolia**: Local development network and public testnet deployment target.

## Project Structure

### Folder Structure

```txt
04-wordlechain/
|-- contract/                 # Solidity smart contracts and tests
|   |-- contracts/             # Contract source files
|   |   |-- libraries/          # Shared Solidity libraries
|   |   |-- WordleGame.sol
|   |   `-- WordleToken.sol
|   |-- script/                # Deployment scripts
|   `-- test/                  # Contract tests
|-- frontend/                 # React frontend
|   |-- public/                # Public assets
|   `-- src/
|       |-- app/                # Providers, router and app shell
|       |-- pages/              # Route-level page composition
|       |-- features/           # Game, token, admin and wallet domains
|       |-- lib/                # Env, toast and contract adapters
|       |-- shared/             # Generic layout and shared utilities
|       |-- theme/              # Joy UI theme setup
|       `-- styles/             # Global styles
|-- scripts/                  # Automation scripts
|-- package.json              # Root scripts
`-- README.md
```

### Main Contract Files

- `contract/contracts/WordleToken.sol`: ERC20 token used in the game for making guesses.
- `contract/contracts/WordleGame.sol`: Manages game state, guesses and feedback.
- `contract/contracts/libraries/WordleScoring.sol`: Shared two-pass Wordle scoring logic.

### Main Frontend Areas

- `frontend/src/app`: App bootstrap, providers and router.
- `frontend/src/pages/game/GamePage.tsx`: Main route-level game composition.
- `frontend/src/pages/game/_components`: Page-private composition components.
- `frontend/src/pages/game/hooks`: Page-owned route orchestration hooks.
- `frontend/src/features/game`: Gameplay state, guess submission, grid and keyboard UI.
- `frontend/src/features/token`: Token balance, minting and approval flows.
- `frontend/src/features/admin`: Admin-only word management.
- `frontend/src/features/wallet`: Wallet connection/session UI.
- `frontend/src/lib/contracts`: ABI, chain and contract address adapters.

## Security Model

This v1 release should be treated as a portfolio/demo game, not a production-secure token game.

The current contract stores the active answer on-chain. Solidity `private` storage is not secret: blockchain storage can still be inspected, so a determined player can recover the answer before guessing. That is not acceptable for a real economic game where guesses cost tokens or rewards have value.

For a production game, replace the plaintext answer model before adding rewards, leaderboards or meaningful economic mechanics. Suitable directions include commit-reveal rounds, an off-chain verifier/oracle, or server-assisted sessions with on-chain settlement. A pure on-chain contract that gives immediate Wordle feedback cannot also keep the answer secret without additional trust or advanced cryptography.

## Project Setup Instructions

### Prerequisites

- **Node.js** v22
- **Foundry** for contract development
- **MetaMask** or another compatible Ethereum wallet

### Environment Variables

Create `.env` files in the root and `/contract` directories with the following variables. Refer to `.env.example` for public placeholders.

Root environment variables:

```env
RPC_URL="rpc_url"
DEPLOYER_KEY="deployer_key"
VITE_PUBLIC_PROJECT_ID="vite_public_project_id"
VITE_WORDLE_TOKEN_ANVIL_ADDRESS="vite_wordle_token_anvil_address"
VITE_WORDLE_GAME_ANVIL_ADDRESS="vite_wordle_game_anvil_address"
VITE_WORDLE_TOKEN_SEPOLIA_ADDRESS="vite_wordle_token_sepolia_address"
VITE_WORDLE_GAME_SEPOLIA_ADDRESS="vite_wordle_game_sepolia_address"
```

The `VITE_WORDLE_*_ADDRESS` values must be valid `0x`-prefixed Ethereum addresses. Missing or invalid contract addresses are shown in the UI and contract write actions are disabled until the selected chain is configured.

Contract environment variables:

```env
DEPLOYER_KEY="deployer_key"
```

Do not commit private deployer keys. If a deployer key is ever committed, rotate it.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/wordlechain.git
cd wordlechain
```

2. Install dependencies, build contracts and prepare the frontend:

```bash
npm run build
```

3. Start the local development flow:

```bash
npm run dev
```

### Testing

Run contract checks with Foundry:

```bash
npm run check:contracts
```

Run frontend checks:

```bash
npm --prefix frontend run lint
npm --prefix frontend run build
```

## How It Works

1. **Mint Tokens**: Players can mint `10 WTK` at a time, up to `100 WTK` per address.
2. **Approve Tokens**: Players approve the game contract to spend their tokens. The current approval flow approves up to `5 WTK`.
3. **Make Guesses**: Each guess deducts `1 WTK` from the player's balance.
4. **Receive Feedback**: The game returns standard Wordle statuses: green for correct position, yellow for misplaced and gray for incorrect.
5. **Set Word**: The admin can set a new word, which resets player state for the new round.

## Potential Features

- **Secure Round Model**: Replace plaintext answer storage with commit-reveal, an oracle/verifier or server-assisted settlement.
- **On-Chain Profiles**: Store player profiles directly on-chain.
- **Analytics**: Provide stats and insights for current and previous games.
- **Rewards**: Introduce rewards for correct guesses after the answer secrecy model is fixed.
- **Leaderboard**: Track top players based on performance.
- **Multi-Network Support**: Expand compatibility to additional networks.

## Contact

- **GitHub**: [Tiago Gil](https://github.com/thetiagogil)
