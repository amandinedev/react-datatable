import React from 'react';
import './TableInfo.scss';

const TableInfo = ({
  totalItems,
  startItem,
  endItem
}) => {
  if (totalItems === 0) {
    return (
      <div className="table-info">
        No data available
      </div>
    );
  }

  const entryText = totalItems === 1 ? 'entry' : 'entries';

  return (
    <div className="table-info" role="status" aria-live="polite">
      Showing {startItem} to {endItem} of {totalItems} {entryText}
    </div>
  );
};

TableInfo.defaultProps = {
  totalItems: 0,
  startItem: 0,
  endItem: 0
};

export default TableInfo;