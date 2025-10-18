import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomSelect from '../CustomSelect';

describe('CustomSelect', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default state', () => {
    render(
      <CustomSelect
        options={mockOptions}
        value="option1"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByRole('button', { name: /Option 1/i })).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(
      <CustomSelect
        options={mockOptions}
        value="option1"
        onChange={mockOnChange}
        label="Test Label"
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should open dropdown when clicked', async () => {
    const user = userEvent.setup();

    render(
      <CustomSelect
        options={mockOptions}
        value="option1"
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button', { name: /Option 1/i });
    await user.click(button);

    // All options should be visible
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should call onChange when option is selected', async () => {
    const user = userEvent.setup();

    render(
      <CustomSelect
        options={mockOptions}
        value="option1"
        onChange={mockOnChange}
      />
    );

    // Open dropdown
    const button = screen.getByRole('button', { name: /Option 1/i });
    await user.click(button);

    // Click option 2
    const option2 = screen.getByRole('button', { name: 'Option 2' });
    await user.click(option2);

    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('should close dropdown after selection', async () => {
    const user = userEvent.setup();

    render(
      <CustomSelect
        options={mockOptions}
        value="option1"
        onChange={mockOnChange}
      />
    );

    // Open dropdown
    const button = screen.getByRole('button', { name: /Option 1/i });
    await user.click(button);

    // Click option 2
    const option2 = screen.getByRole('button', { name: 'Option 2' });
    await user.click(option2);

    // Dropdown should be closed (options not visible)
    expect(screen.queryByRole('button', { name: 'Option 3' })).not.toBeInTheDocument();
  });

  it('should close dropdown when clicking outside', async () => {
    render(
      <div>
        <CustomSelect
          options={mockOptions}
          value="option1"
          onChange={mockOnChange}
        />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    // Open dropdown
    const button = screen.getByRole('button', { name: /Option 1/i });
    fireEvent.click(button);

    // Options should be visible
    expect(screen.getByText('Option 2')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));

    // Options should not be visible
    expect(screen.queryByRole('button', { name: 'Option 2' })).not.toBeInTheDocument();
  });

  it('should show selected option as highlighted', async () => {
    const user = userEvent.setup();

    render(
      <CustomSelect
        options={mockOptions}
        value="option2"
        onChange={mockOnChange}
      />
    );

    // Open dropdown
    const button = screen.getByRole('button', { name: /Option 2/i });
    await user.click(button);

    // Get all buttons with "Option 2" text (trigger + option in dropdown)
    const allOption2Buttons = screen.getAllByRole('button', { name: 'Option 2' });

    // The second one should be the option in the dropdown with special styling
    const selectedOption = allOption2Buttons[1];
    expect(selectedOption).toHaveClass('bg-[#00ff4d]');
  });

  it('should show placeholder when no value is selected', () => {
    render(
      <CustomSelect
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Select...')).toBeInTheDocument();
  });
});
