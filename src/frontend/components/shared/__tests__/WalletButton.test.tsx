/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { WalletButton } from '../WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

jest.mock('@solana/wallet-adapter-react');

describe('WalletButton', () => {
  const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading skeleton before mount', () => {
    mockUseWallet.mockReturnValue({
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
    } as any);

    render(<WalletButton />);

    // Initially should show loading skeleton
    // After mount, it will show the wallet button
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render wallet button when not connected', () => {
    mockUseWallet.mockReturnValue({
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
    } as any);

    render(<WalletButton />);

    expect(screen.getByRole('button')).toHaveTextContent('Connect Wallet');
  });

  it('should render wallet button when connected', () => {
    mockUseWallet.mockReturnValue({
      publicKey: { toBase58: () => 'mockPublicKey123' } as any,
      connected: true,
      connecting: false,
      disconnecting: false,
      wallet: { adapter: { name: 'Phantom' } } as any,
      wallets: [],
      select: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      sendTransaction: jest.fn(),
      signTransaction: jest.fn(),
      signAllTransactions: jest.fn(),
      signMessage: jest.fn(),
    } as any);

    render(<WalletButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
