import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../../src/components/SearchBar/SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders search input with placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Search employees..." />);
    
    expect(screen.getByPlaceholderText('Search employees...')).toBeInTheDocument();
  });

  // UPDATED: Removed debounce test since it's no longer in the component
  // NEW: Tests immediate search on input change
  it('calls onSearch immediately on input change', async () => {
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'test');
    
    // Should be called multiple times (once for each keystroke)
    expect(mockOnSearch).toHaveBeenCalledTimes(4); // t, e, s, t
    expect(mockOnSearch).toHaveBeenCalledWith('t');
    expect(mockOnSearch).toHaveBeenCalledWith('te');
    expect(mockOnSearch).toHaveBeenCalledWith('tes');
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  it('shows clear button when has value', () => {
    render(<SearchBar onSearch={mockOnSearch} value="test" />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Clear search');
  });

  it('hides clear button when value is empty', () => {
    render(<SearchBar onSearch={mockOnSearch} value="" />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('clears search when clear button clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} value="test" />);
    
    const clearButton = screen.getByRole('button');
    await user.click(clearButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  // NEW: Tests Escape key functionality
  it('clears search when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} value="test" />);
    
    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, '{Escape}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  // NEW: Tests that the component syncs with external value changes
  it('updates input value when value prop changes', () => {
    const { rerender } = render(<SearchBar onSearch={mockOnSearch} value="initial" />);
    
    expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
    
    rerender(<SearchBar onSearch={mockOnSearch} value="updated" />);
    
    expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
  });

  // NEW: Tests label rendering
  it('renders label when showLabel is true', () => {
    render(<SearchBar onSearch={mockOnSearch} label="Find:" showLabel={true} />);
    
    expect(screen.getByText('Find:')).toBeInTheDocument();
    expect(screen.getByLabelText('Find:')).toBeInTheDocument();
  });

  it('does not render label when showLabel is false', () => {
    render(<SearchBar onSearch={mockOnSearch} label="Find:" showLabel={false} />);
    
    expect(screen.queryByText('Find:')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  // UPDATED: Changed test to not use data-testid since it's not in the component
  it('applies custom className', () => {
    render(<SearchBar onSearch={mockOnSearch} className="custom-search" />);
    
    // We can find by role or class name instead
    const container = document.querySelector('.search-bar.custom-search');
    expect(container).toBeInTheDocument();
  });

  // NEW: Tests accessibility attributes
  it('has proper accessibility attributes', () => {
    render(<SearchBar onSearch={mockOnSearch} label="Search data" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Search data');
    
    // If label is shown, it should be associated with the input
    const label = screen.getByText('Search data');
    expect(label).toHaveAttribute('for', 'search-input');
    expect(input).toHaveAttribute('id', 'search-input');
  });
});