import { render, screen } from '@testing-library/react';
import UserNavigation from '../UserNavigation';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation');

describe('UserNavigation', () => {
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render logo', () => {
    mockUsePathname.mockReturnValue('/');

    render(<UserNavigation />);

    expect(screen.getByText('NFT Coupons')).toBeInTheDocument();
  });

  it('should render all navigation links', () => {
    mockUsePathname.mockReturnValue('/');

    render(<UserNavigation />);

    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Marketplace/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /My Coupons/i })).toBeInTheDocument();
  });

  it('should highlight active link on homepage', () => {
    mockUsePathname.mockReturnValue('/');

    render(<UserNavigation />);

    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toHaveClass('bg-[#00ff4d]');
  });

  it('should highlight active link on marketplace page', () => {
    mockUsePathname.mockReturnValue('/marketplace');

    render(<UserNavigation />);

    const marketplaceLink = screen.getByRole('link', { name: /Marketplace/i });
    expect(marketplaceLink).toHaveClass('bg-[#00ff4d]');
  });

  it('should highlight active link on coupons page', () => {
    mockUsePathname.mockReturnValue('/coupons');

    render(<UserNavigation />);

    const couponsLink = screen.getByRole('link', { name: /My Coupons/i });
    expect(couponsLink).toHaveClass('bg-[#00ff4d]');
  });

  it('should render wallet button', () => {
    mockUsePathname.mockReturnValue('/');

    render(<UserNavigation />);

    // Wallet button is mocked in jest.setup.js
    expect(screen.getByRole('button', { name: /Connect Wallet/i })).toBeInTheDocument();
  });

  it('should have correct navigation href links', () => {
    mockUsePathname.mockReturnValue('/');

    render(<UserNavigation />);

    const homeLink = screen.getByRole('link', { name: /Home/i });
    const marketplaceLink = screen.getByRole('link', { name: /Marketplace/i });
    const couponsLink = screen.getByRole('link', { name: /My Coupons/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(marketplaceLink).toHaveAttribute('href', '/marketplace');
    expect(couponsLink).toHaveAttribute('href', '/coupons');
  });
});
