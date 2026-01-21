import { describe, it, expect, vi } from 'vitest';
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

  it('renders with default props', () => {
    renderComponent();
    
    expect(screen.getByTestId('page-size-selector')).toBeInTheDocument();
    expect(screen.getByTestId('page-size-select')).toHaveValue('10');
  });

  it('shows "Show X entries" format', () => {
    renderComponent();
    
    // Should show "Show" label
    const showLabels = screen.getAllByText('Show');
    expect(showLabels.length).toBeGreaterThan(0);
    
    // Should show "entries" label
    const entriesLabels = screen.getAllByText('entries');
    expect(entriesLabels.length).toBeGreaterThan(0);
  });

  it('shows all default options', () => {
    renderComponent();
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    await user.selectOptions(screen.getByTestId('page-size-select'), '25');
    
    expect(mockOnChange).toHaveBeenCalledWith(25);
  });

  it('always shows labels in "Show X entries" format', () => {
    renderComponent();
    
    // Labels should always be visible (showLabel prop was removed)
    expect(screen.getByText('Show')).toBeInTheDocument();
    expect(screen.getByText('entries')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { container } = renderComponent({ size: 'small' });
    
    expect(container.querySelector('.page-size-selector')).toHaveClass('size-small');
  });

  it('accepts custom options', () => {
    renderComponent({ options: [20, 40, 60] });
    
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    renderComponent();
    
    // Should have appropriate aria-label for accessibility
    expect(screen.getByTestId('page-size-select')).toHaveAttribute('aria-label', 'Number of entries to show');
  });

  it('updates value when prop changes', () => {
    const { rerender } = renderComponent({ value: 10 });
    
    expect(screen.getByTestId('page-size-select')).toHaveValue('10');
    
    rerender(
      <PageSizeSelector
        value={25}
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByTestId('page-size-select')).toHaveValue('25');
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Tab to the select
    await user.tab();
    
    const select = screen.getByTestId('page-size-select');
    expect(select).toHaveFocus();
    
    // Select an option using keyboard navigation
    await user.keyboard('[ArrowDown]'); // Navigate to 5
    await user.keyboard('[ArrowDown]'); // Navigate to 25 (since 10 is current value)
    await user.keyboard('[Enter]');
    
    expect(mockOnChange).toHaveBeenCalledWith(25);
  });

  it('renders with custom size prop', () => {
    const { container } = renderComponent({ size: 'large' });
    
    expect(container.querySelector('.page-size-selector')).toHaveClass('size-large');
  });

  it('handles null onChange gracefully', () => {
    // Should not throw when there's no onChange handler
    expect(() => {
      renderComponent({ onChange: undefined });
    }).not.toThrow();
  });

  it('maintains proper structure with labels and select', () => {
    const { container } = renderComponent();
    
    const selector = container.querySelector('.page-size-selector');
    const labels = selector.querySelectorAll('.page-size-selector__label');
    const wrapper = selector.querySelector('.page-size-selector__wrapper');
    const select = selector.querySelector('.page-size-selector__select');
    const arrow = selector.querySelector('.page-size-selector__arrow');
    
    // Should have 2 labels (Show and entries)
    expect(labels.length).toBe(2);
    expect(labels[0]).toHaveTextContent('Show');
    expect(labels[1]).toHaveTextContent('entries');
    
    // Should have wrapper with select and arrow
    expect(wrapper).toBeInTheDocument();
    expect(select).toBeInTheDocument();
    expect(arrow).toBeInTheDocument();
  });
});