const fs = require('fs');
const path = require('path');

describe('contracts folder structure and scripts', () => {
  const root = path.resolve(__dirname, '..');

  it('should include an .env.example', () => {
    expect(fs.existsSync(path.join(root, '.env.example'))).toBe(true);
  });

  it('should include deploy scripts', () => {
    const scriptsDir = path.join(root, 'scripts');
    expect(fs.existsSync(path.join(scriptsDir, 'deploy.sh'))).toBe(true);
    expect(fs.existsSync(path.join(scriptsDir, 'deploy_testnet.sh'))).toBe(true);
    expect(fs.existsSync(path.join(scriptsDir, 'add-levels.sh'))).toBe(true);
  });

  it('package.json should define compile, deploy, and add-levels scripts', () => {
    const pkg = require(path.join(root, 'package.json'));
    expect(pkg.scripts).toBeDefined();
    expect(pkg.scripts.compile).toBeDefined();
    expect(pkg.scripts.deploy).toBeDefined();
    expect(pkg.scripts['add-levels']).toBeDefined();
  });
});