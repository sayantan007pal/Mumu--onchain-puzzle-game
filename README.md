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
- Python 3.8+ and Cairo Lang for contract compilation and Starknet CLI (install via `pip install cairo-lang==0.8.0`). See [Cairo Lang Quickstart](https://www.cairo-lang.org/docs/quickstart.html) for more details.

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

#### Configure `frontend/.env`

Great! You have Argent X installed and a wallet created. Here’s how you can get the values for your `.env` file:

---

### 1. `VITE_GAME_CONTRACT_ADDRESS`

This is the address of your deployed game contract on Starknet.  
**You need to deploy your contract first** (using tools like [Starknet CLI](https://docs.starknet.io/documentation/tools/cli/), [Starknet.js](https://www.starknetjs.com/), or [Voyager](https://voyager.online/) if you have a contract ready).

- If you have already deployed your contract, you’ll find the address in the deployment output.
- If not, you need to deploy your contract and copy the address.

**Example:**
```
VITE_GAME_CONTRACT_ADDRESS=0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

---

### 2. `VITE_STARKNET_RPC_URL` for Argent X

Argent X connects to Starknet via RPC endpoints.  
You need a Starknet RPC URL (for testnet or mainnet).  
Argent X uses public endpoints by default, but for dApp development, you can use:

#### **Testnet:**
```
VITE_STARKNET_RPC_URL=https://starknet-testnet.public.blastapi.io/rpc/v0_6
```

#### **Mainnet:**
```
VITE_STARKNET_RPC_URL=https://starknet-mainnet.public.blastapi.io/rpc/v0_6
```

You can also use other providers like [Infura](https://www.infura.io/), [Alchemy](https://www.alchemy.com/), or [Chainstack](https://chainstack.com/) if you want your own API key.

---

### 3. **How to use with Argent X**

- Argent X will automatically detect the network (testnet/mainnet) based on your wallet’s selected network.
- Your dApp should use the same network as your wallet for seamless interaction.

---

### 4. **Sample `.env` file**

```env
VITE_GAME_CONTRACT_ADDRESS=0xYOUR_GAME_CONTRACT_ADDRESS
VITE_STARKNET_RPC_URL=https://starknet-testnet.public.blastapi.io/rpc/v0_6
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

## ✅ Testing

### Install dependencies

```bash
yarn install
```

### Contracts tests

```bash
cd contracts
yarn test
```

### Frontend tests

```bash
cd frontend
yarn test
```

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