import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../../src/components/Pagination/Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('does not render when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders with correct page numbers', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    // Should show page numbers around current page
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Should show ellipsis
    const ellipsisElements = screen.getAllByText('...');
    expect(ellipsisElements.length).toBe(1);
  });

  it('shows Previous and Next buttons with text', () => {
    render(
      <Pagination 
        currentPage={2} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(
      <Pagination 
        currentPage={5} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when page number is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const page5 = screen.getByText('5');
    await user.click(page5);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it('calls onPageChange when Previous button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const prevButton = screen.getByText('Previous');
    await user.click(prevButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when Next button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('shows active page with correct class', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const page3 = screen.getByText('3');
    expect(page3).toHaveClass('active');
  });

  it('respects maxVisiblePages prop', () => {
    render(
      <Pagination 
        currentPage={5} 
        totalPages={20} 
        onPageChange={mockOnPageChange} 
        maxVisiblePages={7}
      />
    );
    
    // Should show 7 visible page numbers (plus first/last pages)
    const visiblePageNumbers = [1, 2, 3, 4, 5, 6, 7, 20];
    visiblePageNumbers.forEach(page => {
      expect(screen.getByText(page.toString())).toBeInTheDocument();
    });
  });

  it('hides page numbers when showPageNumbers is false', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
        showPageNumbers={false}
      />
    );
    
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('hides navigation when showNavigation is false', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
        showNavigation={false}
      />
    );
    
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows all pages when totalPages is less than or equal to maxVisiblePages', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
        maxVisiblePages={5}
      />
    );
    
    // Should show all 5 pages without ellipsis
    [1, 2, 3, 4, 5].forEach(page => {
      expect(screen.getByText(page.toString())).toBeInTheDocument();
    });
    
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('renders correctly with default props', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={3} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    // Should render with all default props
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});