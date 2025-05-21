const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

describe('contracts prerequisites', () => {
  it('starknet-compile CLI is installed', () => {
    const cliCompile = path.resolve(__dirname, '../../venv310/bin/starknet-compile');
    expect(() => execSync(`${cliCompile} --version`)).not.toThrow();
  });

  it('starknet CLI is installed', () => {
    const cli = path.resolve(__dirname, '../../venv310/bin/starknet');
    expect(() => execSync(`${cli} --version`)).not.toThrow();
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