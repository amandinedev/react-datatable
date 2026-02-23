import "./PageButton.scss";

/**
 * A button component for individual page navigation in pagination
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.page - The page number this button represents
 * @param {number} props.currentPage - The currently active page number
 * @param {function(number): void} props.onPageChange - Callback function when page button is clicked
 *
 * @returns {JSX.Element} Rendered page button
 */

const PageButton = ({ page, currentPage, onPageChange }) => {
  // ===== DERIVED VALUES =====
  const isActive = currentPage === page;

  // ===== RENDER =====
  return (
    <button
      className={`page-number ${isActive ? "active" : ""}`}
      onClick={() => onPageChange(page)}
      aria-label={`Go to page ${page}`}
      aria-current={isActive ? "page" : undefined}
      role="listitem"
    >
      {page}
    </button>
  );
};

export default PageButton;
