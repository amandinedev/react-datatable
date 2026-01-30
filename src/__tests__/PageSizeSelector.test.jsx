import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageSizeSelector from '../../src/components/PageSizeSelector/PageSizeSelector';

describe('PageSizeSelector Component', () => {
  const mockOnChange = vi.fn();

  const renderComponent = (props = {}) => {
    return render(
      <PageSizeSelector
        value={10}
        onChange={mockOnChange}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with default props', () => {
    renderComponent();
    
    expect(screen.getByTestId('page-size-selector')).toBeInTheDocument();
    expect(screen.getByTestId('page-size-trigger')).toHaveTextContent('10');
  });

  it('shows "Show X entries" format', () => {
    renderComponent();
    
    expect(screen.getByText('Show')).toBeInTheDocument();
    expect(screen.getByText('entries')).toBeInTheDocument();
  });

  it('shows all default options when dropdown is open', async () => {
  const user = userEvent.setup();
  renderComponent();
  
  // Open the dropdown
  await user.click(screen.getByTestId('page-size-trigger'));
  
  // Get all option buttons
  const optionButtons = screen.getAllByRole('option');
  
  // Check we have 5 options
  expect(optionButtons).toHaveLength(5);
  
  // Check the text content of each option
  const optionTexts = optionButtons.map(button => button.textContent);
  expect(optionTexts).toEqual(['5', '10', '25', '50', '100']);
});

  it('calls onChange when an option is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Open the dropdown
    await user.click(screen.getByTestId('page-size-trigger'));
    
    // Click on option 25
    await user.click(screen.getByTestId('page-size-option-25'));
    
    expect(mockOnChange).toHaveBeenCalledWith(25);
  });

  it('closes dropdown after selecting an option', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Open the dropdown
    await user.click(screen.getByTestId('page-size-trigger'));
    expect(screen.getByTestId('page-size-options')).toBeInTheDocument();
    
    // Click on option 25
    await user.click(screen.getByTestId('page-size-option-25'));
    
    // Dropdown should be closed
    expect(screen.queryByTestId('page-size-options')).not.toBeInTheDocument();
  });

  it('accepts custom options', async () => {
  const user = userEvent.setup();
  renderComponent({ options: [20, 40, 60] });
  
  // Open the dropdown
  await user.click(screen.getByTestId('page-size-trigger'));
  
  // Check each custom option exists with the correct text
  expect(screen.getByRole('option', { name: '20' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '40' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '60' })).toBeInTheDocument();
  
  // Default option (10) should not be present
  expect(screen.queryByRole('option', { name: '10' })).not.toBeInTheDocument();
  
  // Verify we have exactly 3 options
  const allOptions = screen.getAllByRole('option');
  expect(allOptions).toHaveLength(3);
});

  it('has proper ARIA attributes', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const trigger = screen.getByTestId('page-size-trigger');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-label', 'Show 10 entries per page');
    
    // Open dropdown and check aria-expanded updates
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('updates value when prop changes', () => {
    const { rerender } = renderComponent({ value: 10 });
    
    expect(screen.getByTestId('page-size-trigger')).toHaveTextContent('10');
    
    rerender(
      <PageSizeSelector
        value={25}
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByTestId('page-size-trigger')).toHaveTextContent('25');
  });

  it('is keyboard accessible - opens with Enter/Space', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Tab to the trigger
    await user.tab();
    
    const trigger = screen.getByTestId('page-size-trigger');
    expect(trigger).toHaveFocus();
    
    // Open with Enter
    await user.keyboard('[Enter]');
    expect(screen.getByTestId('page-size-options')).toBeInTheDocument();
    
    // Close with Escape
    await user.keyboard('[Escape]');
    expect(screen.queryByTestId('page-size-options')).not.toBeInTheDocument();
    
    // Open with Space
    await user.keyboard('[Space]');
    expect(screen.getByTestId('page-size-options')).toBeInTheDocument();
  });

  it('handles disabled state', async () => {
    const user = userEvent.setup();
    renderComponent({ disabled: true });
    
    const trigger = screen.getByTestId('page-size-trigger');
    
    // Should have disabled class
    expect(trigger).toHaveClass('page-size-selector__trigger--disabled');
    
    // Should not open on click
    await user.click(trigger);
    expect(screen.queryByTestId('page-size-options')).not.toBeInTheDocument();
    
    // Should not call onChange
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('maintains proper structure with labels, trigger button, and arrow', () => {
    renderComponent();
    
    const selector = screen.getByTestId('page-size-selector');
    const labels = selector.querySelectorAll('.page-size-selector__label');
    const wrapper = selector.querySelector('.page-size-selector__wrapper');
    const trigger = selector.querySelector('.page-size-selector__trigger');
    const arrow = selector.querySelector('.page-size-selector__arrow');
    
    // Should have 2 labels (Show and entries)
    expect(labels.length).toBe(2);
    expect(labels[0]).toHaveTextContent('Show');
    expect(labels[1]).toHaveTextContent('entries');
    
    // Should have wrapper with trigger button and arrow
    expect(wrapper).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveTextContent('▼');
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Open the dropdown
    await user.click(screen.getByTestId('page-size-trigger'));
    expect(screen.getByTestId('page-size-options')).toBeInTheDocument();
    
    // Click outside
    await user.click(document.body);
    
    // Dropdown should be closed
    expect(screen.queryByTestId('page-size-options')).not.toBeInTheDocument();
  });

  it('highlights the selected option', async () => {
    const user = userEvent.setup();
    renderComponent({ value: 25 });
    
    // Open the dropdown
    await user.click(screen.getByTestId('page-size-trigger'));
    
    // Option 25 should have selected class
    const selectedOption = screen.getByTestId('page-size-option-25');
    expect(selectedOption).toHaveClass('page-size-selector__option--selected');
    
    // Other options should not have selected class
    const otherOption = screen.getByTestId('page-size-option-10');
    expect(otherOption).not.toHaveClass('page-size-selector__option--selected');
  });

  it('does not call onChange when selecting the same value', async () => {
    const user = userEvent.setup();
    renderComponent({ value: 10 });
    
    // Open the dropdown
    await user.click(screen.getByTestId('page-size-trigger'));
    
    // Click on already selected option (10)
    await user.click(screen.getByTestId('page-size-option-10'));
    
    // Should not call onChange since value didn't change
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});