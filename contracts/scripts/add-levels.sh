#!/usr/bin/env bash
set -e

# Load environment variables
source "$(dirname "$0")/../.env"

echo "Invoking add_levels on $GAME_CONTRACT_ADDRESS..."
starknet invoke \
  --network "$STARKNET_NETWORK" \
  --address "$GAME_CONTRACT_ADDRESS" \
  --abi build/game.json \
  --function add_levels \
  --inputs /* level data placeholders */