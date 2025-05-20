#!/usr/bin/env bash
set -e

# Load environment variables from .env in the same folder
source "$(dirname "$0")/../.env"

# Compile Cairo contracts
mkdir -p build
starknet-compile src/*.cairo --output build/game.json

# Deploy to the specified network
starknet deploy \
  --network "$STARKNET_NETWORK" \
  --contract build/game.json