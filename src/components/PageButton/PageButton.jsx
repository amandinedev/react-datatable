import React from 'react';
import PropTypes from 'prop-types';
import './PageButton.scss';

const PageButton = ({ page, currentPage, onPageChange }) => {
  // ===== DERIVED VALUES =====
  const isActive = currentPage === page;
  
  // ===== RENDER =====
  return (
    <button
      className={`page-number ${isActive ? 'active' : ''}`}
      onClick={() => onPageChange(page)}
      aria-label={`Go to page ${page}`}
      aria-current={isActive ? 'page' : undefined}
      role="listitem"
    >
      {page}
    </button>
  );
};

// ===== PROP TYPES =====
PageButton.propTypes = {
  page: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default PageButton;