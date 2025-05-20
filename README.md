# MuMu - On-Chain Puzzle Game

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Starknet](https://img.shields.io/badge/Starknet-Powered-blue)](https://starknet.io/)

## 🧩 About MuMu

MuMu is a fully on-chain puzzle game built on Starknet where players interact with matter that transforms according to predefined formulas. All game logic and state are stored entirely on the blockchain, making it a truly decentralized gaming experience.

In MuMu, you'll navigate challenging puzzles by understanding and manipulating matter transformations. Different types of matter elements change when specific conditions are met, requiring strategic thinking and planning to solve each level.

## 🎮 Game Mechanics

### Matter Types

MuMu features five different types of matter, each with unique properties:

1. **Water (Type 1)** - Blue
2. **Earth (Type 2)** - Brown
3. **Fire (Type 3)** - Orange
4. **Air (Type 4)** - Light Blue
5. **Aether (Type 5)** - Purple

### Transformation Rules

Matter transforms according to these formulas:

- **Water** → **Earth** when surrounded by two or more Fire elements
- **Earth** → **Air** when adjacent to both Water and Aether
- **Fire** → **Water** when all adjacent cells are empty
- **Air** → **Aether** when adjacent to three or more other matters
- **Aether** → **Fire** when adjacent to Air

## 🚀 Getting Started

### Play the Game

Visit [https://your-app.vercel.app](https://your-app.vercel.app) to play the deployed version.

### Prerequisites

- A Starknet-compatible wallet (Argent X, Braavos)
- Some ETH on Starknet for transaction fees
- Node.js and npm (or Yarn) for local development

### Local Development

Follow these steps to run the frontend locally:

```bash
cd frontend
# Copy and configure environment variables
cp .env.example .env
# Install dependencies
npm install    # or yarn install
# Start development server
npm run dev    # or yarn dev
```

## 🛠️ Smart Contract

The game's core logic is implemented in Cairo, Starknet's native programming language.

### Contract Address

- Mainnet: `0x0123...` (coming soon)
- Testnet: `0x0456...`

### Deploying the Contract

```bash
# Copy and update environment for contracts
cp contracts/.env.example contracts/.env
# Edit contracts/.env with your private key, network, and RPC URL

cd contracts
 yarn install
 yarn compile
 yarn deploy
 yarn add-levels
```

## 📐 Architecture

The on-chain game logic lives in the `contracts/` folder (Cairo smart contracts), while the React frontend resides in `frontend/`. Smart contracts enforce state and transformations; the frontend provides the user interface.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Starknet](https://starknet.io/) for providing the L2 infrastructure
- [StarknetKit](https://github.com/starknet-io/starknetkit) for wallet connection utilities
- [React](https://reactjs.org/) for the frontend framework
- [The Cairo Language](https://www.cairo-lang.org/) for smart contract development

## 📧 Contact

- Twitter: [@MuMuGame](https://twitter.com/MuMuGame)
- Discord: [MuMu Community](https://discord.gg/mumu)
- Email: contact@mumu-game.xyz