# Security Policy

## Reporting a Vulnerability

We take the security of the Web3 Deal Discovery & NFT Coupons platform seriously. If you discover a security vulnerability, we appreciate your help in disclosing it to us responsibly.

### How to Report

**Please DO NOT open a public GitHub issue for security vulnerabilities.**

Instead, please report security vulnerabilities by:

1. **Email**: Send details to security@rectorspace.com (if available)
2. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature
   - Navigate to the repository's Security tab
   - Click "Report a vulnerability"
   - Fill out the advisory form

### What to Include

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, SQL injection, authentication bypass)
- Full paths of affected source files
- Location of the affected code (tag/branch/commit/direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Potential impact of the vulnerability
- Suggested fix (if you have one)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-30 days
  - Medium: 30-90 days
  - Low: Best effort

### Scope

The following are **IN SCOPE** for vulnerability reports:

- Smart contract vulnerabilities (NFT program)
- Authentication and authorization bypass
- Cross-site scripting (XSS)
- SQL injection and database vulnerabilities
- Server-side request forgery (SSRF)
- Remote code execution (RCE)
- Sensitive data exposure
- Cryptographic vulnerabilities
- Business logic flaws affecting security

The following are **OUT OF SCOPE**:

- Social engineering attacks
- Physical attacks
- Denial of service (DoS) attacks
- Issues in third-party dependencies (report to the maintainer)
- Vulnerabilities requiring physical access
- Issues that require unlikely user interaction
- Best practice violations without demonstrable security impact

### Disclosure Policy

- Please give us reasonable time to fix the vulnerability before public disclosure
- We will credit security researchers who report valid vulnerabilities (unless you prefer to remain anonymous)
- We may publicly disclose the vulnerability after a fix is released

### Security Best Practices

For users and developers:

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Keep dependencies updated**: Regularly run `npm audit` and update packages
3. **Use strong authentication**: Enable 2FA on all accounts
4. **Review smart contract interactions**: Always verify transaction details before signing
5. **Test in devnet first**: Never test with real funds on mainnet

### Known Security Considerations

- **Devnet vs Mainnet**: Currently deployed on Solana devnet. Production deployment requires additional security hardening.
- **API Keys**: Ensure all API keys are properly secured and rotated regularly
- **Database Access**: Service role keys should only be used server-side, never exposed to clients
- **Smart Contract Audits**: Contract has not undergone formal security audit yet (recommended before mainnet)

### Contact

For general security questions or concerns, please contact:
- Email: security@rectorspace.com
- GitHub: Open a discussion in the Security category

---

**Thank you for helping keep our platform and users safe!**
