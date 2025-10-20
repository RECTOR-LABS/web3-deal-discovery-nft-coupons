# Husky Git Hooks

This directory contains Git hooks managed by Husky.

## Pre-commit Hook

Runs automatically before each commit to ensure code quality:

1. **Lint Staged Files** - ESLint fixes and formatting
2. **Type Check** - TypeScript strict checking
3. **Tests** - Optional, currently commented out

## Setup

Husky is automatically initialized when you run:

```bash
npm install
```

## Manual Initialization

If hooks are not working:

```bash
npm run prepare
```

## Bypass Hooks (Emergency Only)

If you need to bypass hooks temporarily:

```bash
git commit --no-verify -m "message"
```

**Warning:** Only use `--no-verify` when absolutely necessary!

## Customize Hooks

Edit `.husky/pre-commit` to:
- Add/remove checks
- Enable test running
- Add custom validation

## Troubleshooting

### Hooks Not Running

1. Check if Husky is installed:
   ```bash
   ls -la .git/hooks
   ```

2. Reinitialize:
   ```bash
   rm -rf .husky
   npm run prepare
   ```

### Slow Commits

- Disable test running in pre-commit
- Use lint-staged to check only changed files
- Run full tests in CI instead

## Learn More

- Husky: https://typicode.github.io/husky/
- Lint-staged: https://github.com/okonet/lint-staged
