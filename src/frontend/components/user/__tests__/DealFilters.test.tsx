import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DealFilters from '../DealFilters';

describe('DealFilters', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnCategoryChange = jest.fn();
  const mockOnSortChange = jest.fn();

  const defaultProps = {
    searchQuery: '',
    onSearchChange: mockOnSearchChange,
    selectedCategory: 'All' as const,
    onCategoryChange: mockOnCategoryChange,
    sortBy: 'newest' as const,
    onSortChange: mockOnSortChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input', () => {
    render(<DealFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/Search deals by title or description/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should call onSearchChange when typing in search', async () => {
    const user = userEvent.setup();

    render(<DealFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/Search deals by title or description/i);
    await user.type(searchInput, 'coffee');

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it('should render all category buttons', () => {
    render(<DealFilters {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Food & Beverage' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retail' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Services' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Travel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entertainment' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Other' })).toBeInTheDocument();
  });

  it('should call onCategoryChange when category button is clicked', async () => {
    const user = userEvent.setup();

    render(<DealFilters {...defaultProps} />);

    const foodButton = screen.getByRole('button', { name: 'Food & Beverage' });
    await user.click(foodButton);

    expect(mockOnCategoryChange).toHaveBeenCalledWith('Food & Beverage');
  });

  it('should highlight selected category', () => {
    render(<DealFilters {...defaultProps} selectedCategory="Retail" />);

    const retailButton = screen.getByRole('button', { name: 'Retail' });
    expect(retailButton).toHaveClass('bg-[#00ff4d]');
  });

  it('should render sort dropdown', () => {
    render(<DealFilters {...defaultProps} />);

    expect(screen.getByText('Sort By')).toBeInTheDocument();
  });

  it('should call onSortChange when sort option is selected', async () => {
    const user = userEvent.setup();

    render(<DealFilters {...defaultProps} />);

    // Open sort dropdown
    const sortButton = screen.getByRole('button', { name: /Newest First/i });
    await user.click(sortButton);

    // Click "Expiring Soon" option
    const expiringSoonOption = screen.getByRole('button', { name: 'Expiring Soon' });
    await user.click(expiringSoonOption);

    expect(mockOnSortChange).toHaveBeenCalledWith('expiring-soon');
  });

  it('should display current search query', () => {
    render(<DealFilters {...defaultProps} searchQuery="pizza" />);

    const searchInput = screen.getByPlaceholderText(/Search deals by title or description/i) as HTMLInputElement;
    expect(searchInput.value).toBe('pizza');
  });

  it('should display current sort value', () => {
    render(<DealFilters {...defaultProps} sortBy="highest-discount" />);

    expect(screen.getByRole('button', { name: /Highest Discount/i })).toBeInTheDocument();
  });
});
