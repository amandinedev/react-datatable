import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import PageButton from '../PageButton/PageButton';
import './Pagination.scss';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  showNavigation = true,
  maxVisiblePages = 5
}) => {
  // ===== DERIVED VALUES =====
  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    if (!showPageNumbers) return [];
    
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages, showPageNumbers, maxVisiblePages]);

  if (totalPages <= 1) return null;

  // ===== EVENT HANDLERS =====
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // ===== DERIVED VALUES =====
  const showStartEllipsis = pageNumbers.length > 0 && pageNumbers[0] > 2;
  const showEndEllipsis = pageNumbers.length > 0 && 
    pageNumbers[pageNumbers.length - 1] < totalPages - 1;

  // ===== RENDER =====
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
            <PageButton
              page={1}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          )}
          
          {/* Start ellipsis */}
          {showStartEllipsis && (
            <span className="page-ellipsis" aria-hidden="true">...</span>
          )}
          
          {/* Page numbers */}
          {pageNumbers.map(page => (
            <PageButton
              key={page}
              page={page}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          ))}
          
          {/* End ellipsis */}
          {showEndEllipsis && (
            <span className="page-ellipsis" aria-hidden="true">...</span>
          )}
          
          {/* Last page */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <PageButton
              page={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
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

// ===== PROP TYPES =====
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showPageNumbers: PropTypes.bool,
  showNavigation: PropTypes.bool,
  maxVisiblePages: PropTypes.number
};

export default Pagination;