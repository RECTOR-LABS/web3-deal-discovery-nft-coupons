import '@testing-library/jest-dom'

// Mock Solana wallet adapter
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(() => ({
    publicKey: null,
    connected: false,
    connecting: false,
    disconnecting: false,
    wallet: null,
    wallets: [],
    select: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    sendTransaction: jest.fn(),
    signTransaction: jest.fn(),
    signAllTransactions: jest.fn(),
    signMessage: jest.fn(),
  })),
  WalletProvider: ({ children }) => children,
  ConnectionProvider: ({ children }) => children,
}))

jest.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <button>Connect Wallet</button>,
  WalletDisconnectButton: () => <button>Disconnect</button>,
  WalletModalProvider: ({ children }) => children,
}))

// Mock Privy authentication
jest.mock('@privy-io/react-auth', () => ({
  usePrivy: jest.fn(() => ({
    ready: true,
    authenticated: false,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  })),
  useWallets: jest.fn(() => ({
    wallets: [],
  })),
  PrivyProvider: ({ children }) => children,
}))

// Mock PrivyLoginButton component
jest.mock('@/components/shared/PrivyLoginButton', () => ({
  __esModule: true,
  default: () => <button>Sign In</button>,
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => children,
}))
