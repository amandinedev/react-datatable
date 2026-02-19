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
  
  await user.click(screen.getByTestId('page-size-trigger'));
  
  const optionButtons = screen.getAllByRole('option');
  
  expect(optionButtons).toHaveLength(5);
  
  const optionTexts = optionButtons.map(button => button.textContent);
  expect(optionTexts).toEqual(['5', '10', '25', '50', '100']);
});

  it('calls onChange when an option is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    await user.click(screen.getByTestId('page-size-trigger'));

    await user.click(screen.getByTestId('page-size-option-25'));
    
    expect(mockOnChange).toHaveBeenCalledWith(25);
  });

  it('closes dropdown after selecting an option', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId('page-size-trigger'));
    expect(screen.getByTestId('page-size-options')).toBeInTheDocument();

    await user.click(screen.getByTestId('page-size-option-25'));
    
    expect(screen.queryByTestId('page-size-options')).not.toBeInTheDocument();
  });

  it('accepts custom options', async () => {
  const user = userEvent.setup();
  renderComponent({ options: [20, 40, 60] });
  
  await user.click(screen.getByTestId('page-size-trigger'));
  
  expect(screen.getByRole('option', { name: '20' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '40' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '60' })).toBeInTheDocument();
  
  expect(screen.queryByRole('option', { name: '10' })).not.toBeInTheDocument();

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
    
    await user.tab();
    
    const trigger = screen.getByTestId('page-size-trigger');
    expect(trigger).toHaveFocus();

    await user.keyboard('[Enter]');
    expect(screen.getByTestId('page-size-options')).toBeInTheDocument();
    
    await user.keyboard('[Escape]');
    expect(screen.queryByTestId('page-size-options')).not.toBeInTheDocument();

    await user.keyboard('[Space]');
    expect(screen.getByTestId('page-size-options')).toBeInTheDocument();
  });

  it('handles disabled state', async () => {
    const user = userEvent.setup();
    renderComponent({ disabled: true });
    
    const trigger = screen.getByTestId('page-size-trigger');
    
    expect(trigger).toHaveClass('page-size-selector__trigger--disabled');

    await user.click(trigger);
    expect(screen.queryByTestId('page-size-options')).not.toBeInTheDocument();

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('maintains proper structure with labels, trigger button, and arrow', () => {
    renderComponent();
    
    const selector = screen.getByTestId('page-size-selector');
    const labels = selector.querySelectorAll('.page-size-selector__label');
    const wrapper = selector.querySelector('.page-size-selector__wrapper');
    const trigger = selector.querySelector('.page-size-selector__trigger');
    const arrow = selector.querySelector('.page-size-selector__arrow');
    
    expect(labels.length).toBe(2);
    expect(labels[0]).toHaveTextContent('Show');
    expect(labels[1]).toHaveTextContent('entries');
    
    expect(wrapper).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveTextContent('▼');
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    await user.click(screen.getByTestId('page-size-trigger'));
    expect(screen.getByTestId('page-size-options')).toBeInTheDocument();
    
    await user.click(document.body);
    
    expect(screen.queryByTestId('page-size-options')).not.toBeInTheDocument();
  });

  it('highlights the selected option', async () => {
    const user = userEvent.setup();
    renderComponent({ value: 25 });
    
    await user.click(screen.getByTestId('page-size-trigger'));
    
    const selectedOption = screen.getByTestId('page-size-option-25');
    expect(selectedOption).toHaveClass('page-size-selector__option--selected');
    
    const otherOption = screen.getByTestId('page-size-option-10');
    expect(otherOption).not.toHaveClass('page-size-selector__option--selected');
  });

  it('does not call onChange when selecting the same value', async () => {
    const user = userEvent.setup();
    renderComponent({ value: 10 });
    
    await user.click(screen.getByTestId('page-size-trigger'));
    
    await user.click(screen.getByTestId('page-size-option-10'));
    
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});