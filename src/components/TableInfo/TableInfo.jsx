import "./TableInfo.scss";

/**
 * A component that displays information about the current table data range
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} [props.totalItems=0] - Total number of items in the table
 * @param {number} [props.startItem=0] - The starting index of the current page
 * @param {number} [props.endItem=0] - The ending index of the current page
 * 
 * @returns {JSX.Element} Rendered table information
 */

const TableInfo = ({ totalItems = 0, startItem = 0, endItem = 0 }) => {
  // ===== RENDER =====
  return (
    <div className="table-info" role="status" aria-live="polite">
      {totalItems === 0
        ? "No data available"
        : `Showing ${startItem} to ${endItem} of ${totalItems} ${totalItems === 1 ? "entry" : "entries"}`}
    </div>
  );
};

export default TableInfo;