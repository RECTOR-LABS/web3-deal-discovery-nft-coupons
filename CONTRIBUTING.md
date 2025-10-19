# Contributing to Web3 Deal Discovery & NFT Coupons

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Prioritize the community's best interests

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Rust and Solana CLI (for smart contract development)
- Git
- A code editor (VS Code recommended)

### Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR_USERNAME/web3-deal-discovery-nft-coupons.git
   cd web3-deal-discovery-nft-coupons
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd src/frontend
   npm install

   # Smart contracts
   cd ../contracts
   cargo build-bpf
   ```

3. **Configure environment**
   ```bash
   cd src/frontend
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Frontend Development

```bash
cd src/frontend
npm run dev          # Start dev server
npm test             # Run tests
npm run typecheck    # TypeScript checking
npm run lint         # ESLint checking
```

### Smart Contract Development

```bash
cd src/contracts
anchor build         # Build contracts
anchor test          # Run tests
anchor deploy        # Deploy to devnet
```

### Project Structure

```
src/
├── frontend/
│   ├── app/              # Next.js routes
│   ├── components/       # React components
│   └── lib/              # Utilities and helpers
└── contracts/
    └── programs/         # Anchor programs
```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript strict mode
- Follow existing code style (enforced by ESLint)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

**Example:**
```typescript
/**
 * Fetches deals from the database
 * @param filters - Optional filters for deals
 * @returns Array of deals matching filters
 */
async function fetchDeals(filters?: DealFilters): Promise<Deal[]> {
  // Implementation
}
```

### Rust/Anchor

- Follow Rust naming conventions
- Add comprehensive error handling
- Document public functions with doc comments
- Write unit tests for business logic

**Example:**
```rust
/// Creates a new NFT coupon
///
/// # Arguments
/// * `ctx` - The program context
/// * `discount` - Discount percentage (0-100)
/// * `expiry` - Expiration timestamp
pub fn create_coupon(ctx: Context<CreateCoupon>, discount: u8, expiry: i64) -> Result<()> {
    // Implementation
}
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow MonkeDAO color scheme:
  - Forest green: `#0d2a13`
  - Cream: `#f2eecb`
  - Neon accent: `#00ff4d`
- Maintain responsive design (mobile-first)

## Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(marketplace): add distance filter for deals
fix(redemption): resolve QR code scanning issue
docs(readme): update setup instructions
test(merchant): add dashboard component tests
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run tests and checks**
   ```bash
   npm test
   npm run typecheck
   npm run lint
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Link related issues
   - Request review

5. **PR Requirements**
   - All tests passing
   - No TypeScript errors
   - No ESLint warnings
   - Code reviewed by at least one maintainer
   - Documentation updated (if needed)

6. **After Approval**
   - Squash commits if requested
   - Maintainer will merge your PR

## Testing

### Frontend Tests

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
```

**Writing Tests:**
```typescript
import { render, screen } from '@testing-library/react';
import DealCard from './DealCard';

describe('DealCard', () => {
  it('displays deal information correctly', () => {
    const deal = { /* mock data */ };
    render(<DealCard deal={deal} />);
    expect(screen.getByText(deal.title)).toBeInTheDocument();
  });
});
```

### Smart Contract Tests

```bash
anchor test
```

**Writing Tests:**
```typescript
it('Creates a coupon successfully', async () => {
  const tx = await program.methods
    .createCoupon(25, expiryDate)
    .accounts({ /* accounts */ })
    .rpc();

  const coupon = await program.account.coupon.fetch(couponPda);
  assert.equal(coupon.discount, 25);
});
```

## Documentation

### When to Update Documentation

- Adding new features
- Changing API interfaces
- Modifying environment variables
- Updating dependencies
- Changing deployment process

### Documentation Files

- **README.md**: Project overview and quick start
- **CLAUDE.md**: Project status and technical details
- **docs/planning/**: PRD, timeline, requirements
- **Code comments**: Complex logic and algorithms

### API Documentation

Document all API routes:
```typescript
/**
 * GET /api/deals/aggregated
 *
 * Fetches aggregated deals from external APIs
 *
 * @returns {NormalizedDeal[]} Array of deals
 * @throws {500} If external API fails
 */
export async function GET(request: NextRequest) {
  // Implementation
}
```

## Questions?

- Open a GitHub Discussion
- Check existing issues and PRs
- Review the documentation in `docs/`

---

**Thank you for contributing!** Your efforts help make this project better for everyone.
