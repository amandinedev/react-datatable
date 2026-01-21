import React, { useMemo } from 'react';
import './Pagination.scss';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  showNavigation = true,
  maxVisiblePages = 5
}) => {
  // Calculate page numbers with proper boundaries
  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    if (!showPageNumbers) return [];
    
    const pages = [];
    
    // Calculate the range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages, showPageNumbers, maxVisiblePages]);

  // Don't render if no pages
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Determine if we should show ellipsis
  const showStartEllipsis = pageNumbers.length > 0 && pageNumbers[0] > 2;
  const showEndEllipsis = pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages - 1;

  return (
    <nav className="pagination" aria-label="Pagination">
      {showNavigation && (
        <button
          className="pagination-button previous"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Previous
        </button>
      )}
      
      {showPageNumbers && pageNumbers.length > 0 && (
        <div className="page-numbers" role="list">
          {/* First page */}
          {pageNumbers[0] > 1 && (
            <button
              className={`page-number ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => onPageChange(1)}
              aria-label={`Go to page 1`}
              aria-current={currentPage === 1 ? 'page' : undefined}
              role="listitem"
            >
              1
            </button>
          )}
          
          {/* Start ellipsis */}
          {showStartEllipsis && (
            <span className="page-ellipsis" aria-hidden="true">
              ...
            </span>
          )}
          
          {/* Page numbers */}
          {pageNumbers.map(page => (
            <button
              key={page}
              className={`page-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              role="listitem"
            >
              {page}
            </button>
          ))}
          
          {/* End ellipsis */}
          {showEndEllipsis && (
            <span className="page-ellipsis" aria-hidden="true">
              ...
            </span>
          )}
          
          {/* Last page */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <button
              className={`page-number ${currentPage === totalPages ? 'active' : ''}`}
              onClick={() => onPageChange(totalPages)}
              aria-label={`Go to page ${totalPages}`}
              aria-current={currentPage === totalPages ? 'page' : undefined}
              role="listitem"
            >
              {totalPages}
            </button>
          )}
        </div>
      )}
      
      {showNavigation && (
        <button
          className="pagination-button next"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      )}
    </nav>
  );
};

Pagination.defaultProps = {
  showPageNumbers: true,
  showNavigation: true,
  maxVisiblePages: 5
};

export default Pagination;