import PropTypes from "prop-types";
import "./TableInfo.scss";

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

// ===== PROP TYPES =====
TableInfo.propTypes = {
  totalItems: PropTypes.number,
  startItem: PropTypes.number,
  endItem: PropTypes.number
};

export default TableInfo;
