const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

describe('contracts prerequisites', () => {
  it('starknet-compile CLI is installed', () => {
    expect(() => execSync('starknet-compile --version')).not.toThrow();
  });

  it('starknet CLI is installed', () => {
    expect(() => execSync('starknet --version')).not.toThrow();
  });

  it('.env file exists and variables are configured', () => {
    const envPath = path.resolve(__dirname, '../.env');
    expect(fs.existsSync(envPath)).toBe(true);
    ['STARKNET_NETWORK', 'STARKNET_RPC_URL', 'PRIVATE_KEY', 'GAME_CONTRACT_ADDRESS'].forEach((key) => {
      expect(process.env[key]).toBeDefined();
      expect(process.env[key]).not.toMatch(/YOUR_/);
    });
  });
});