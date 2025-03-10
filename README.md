# MuMu - On-Chain Puzzle Game

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Starknet](https://img.shields.io/badge/Starknet-Powered-blue)](https://starknet.io/)

MuMu Game Logo


<img width="1352" alt="Screenshot 2025-03-10 at 5 04 37 PM" src="https://github.com/user-attachments/assets/9f3e874d-4f85-4c25-95ed-1b834116a23f" />


## 🧩 About MuMu

MuMu is a fully on-chain puzzle game built on Starknet where players interact with matter that transforms according to predefined formulas. All game logic and state are stored entirely on the blockchain, making it a truly decentralized gaming experience.

In MuMu, you'll navigate through challenging puzzles by understanding and manipulating matter transformations. Different types of matter elements change when specific conditions are met, requiring strategic thinking and planning to solve each level.

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

- **Water** transforms to **Earth** when surrounded by two or more Fire elements
- **Earth** transforms to **Air** when adjacent to both Water and Aether
- **Fire** transforms to **Water** when all adjacent cells are empty
- **Air** transforms to **Aether** when adjacent to three or more other matters
- **Aether** transforms to **Fire** when adjacent to Air

Understanding these rules is the key to solving the game's puzzles!

## 🚀 Getting Started

### Prerequisites

- A Starknet-compatible wallet (Argent X, Braavos)
- Some ETH on Starknet for transaction fees
- Node.js and Yarn for local development

### Play the Game

Visit [(https://mu-mu-s1.netlify.app/)](https://mu-mu-s1.netlify.app/) to play the deployed version.

1. Connect your Starknet wallet
2. Select a level
3. Click on matter elements to trigger transformations
4. Solve the puzzle by reaching the target configuration

### Local Development

Clone the repository:

```bash
git clone https://github.com/yourusername/mumu-game.git
cd mumu-game
```

Install dependencies:

```bash
# Install root dependencies
yarn install

# Install frontend dependencies
cd frontend
yarn install
```

Start the development server:

```bash
cd frontend
yarn dev
```

## 🛠️ Smart Contract

The game's core logic is implemented in Cairo, Starknet's native programming language.

### Contract Address

- Mainnet: `0x0123...` (coming soon)
- Testnet: `0x0456...`

### Deploying the Contract

1. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your private key and RPC URL
```

2. Compile and deploy:

```bash
cd contracts
yarn compile
yarn deploy
```

3. Add game levels:

```bash
yarn add-levels
```

## 🧪 Creating New Levels

You can create your own levels using our level editor tool:

```bash
cd tools/level-editor
yarn start
```

The tool will help you:

1. Design the initial board state
2. Test transformations
3. Verify there's a valid solution
4. Calculate the solution hash
5. Deploy your level to the contract

## 📐 Architecture

MuMu is built with a clean separation between the on-chain game logic and the frontend application:

![Architecture Diagram](./docs/images/architecture.png)

- **Smart Contract**: Handles all game logic, state transitions, and stores player progress
- **Frontend**: React application that visualizes the game state and interacts with the contract


```mumu-game/
├── contracts/               # Starknet smart contracts
│   ├── src/
│   │   ├── game_core.cairo
│   │   ├── puzzle_factory.cairo
│   │   ├── player_progress.cairo
│   │   ├── puzzle_marketplace.cairo
│   │   ├── libraries/
│   │   │   ├── formula_parser.cairo
│   │   │   ├── matter_types.cairo
│   │   │   └── grid_operations.cairo
│   ├── tests/
│   │   ├── test_game_core.cairo
│   │   ├── test_puzzle_factory.cairo
│   │   └── test_formula_parser.cairo
│   └── scripts/
│       ├── deploy.sh
│       └── deploy_testnet.sh
├── frontend/               # Browser game interface
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   │       └── images/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── GameBoard.tsx
│   │   │   ├── MatterElement.tsx
│   │   │   ├── FormulaDisplay.tsx
│   │   │   ├── PuzzleSelector.tsx
│   │   │   └── PuzzleCreator.tsx
│   │   ├── hooks/
│   │   │   ├── useStarknet.ts
│   │   │   ├── useGameState.ts
│   │   │   └── useFormulaParser.ts
│   │   ├── utils/
│   │   │   ├── formulaUtils.ts
│   │   │   ├── gridUtils.ts
│   │   │   └── contractInteraction.ts
│   │   ├── types/
│   │   │   ├── GameTypes.ts
│   │   │   └── ContractTypes.ts
│   │   └── styles/
│   │       ├── GameBoard.css
│   │       └── global.css
│   ├── package.json
│   └── tsconfig.json
├── README.md
├── LICENSE
├── CONTRIBUTING.md
└── package.json
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guidelines](./docs/CONTRIBUTING.md) for details on how to get involved.

## 🙏 Acknowledgements

- [Starknet](https://starknet.io/) for providing the L2 infrastructure
- [StarknetKit](https://github.com/starknet-io/starknetkit) for wallet connection utilities
- [React](https://reactjs.org/) for the frontend framework
- [The Cairo Language](https://www.cairo-lang.org/) for smart contract development

## 📧 Contact

- Twitter: [@MuMuGame](https://twitter.com/MuMuGame)
- Discord: [MuMu Community](https://discord.gg/mumu)
- Email: contact@mumu-game.xyz
