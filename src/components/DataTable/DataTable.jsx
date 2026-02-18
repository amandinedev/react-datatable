import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import SearchBar from "../SearchBar/SearchBar";
import PageSizeSelector from "../PageSizeSelector/PageSizeSelector";
import Pagination from "../Pagination/Pagination";
import TableInfo from "../TableInfo/TableInfo";
import "./DataTable.scss";

const DataTable = ({
  // Data
  data = [],
  columns = [],

  // Configuration
  itemsPerPage: initialItemsPerPage = 10,
  searchable = true,
  sortable = true,
  pagination = true,
  striped = false,
  theme = "light",

  // Customization
  searchPlaceholder = "Search...",
  emptyMessage = "No data available",
  loading = false,
  loadingMessage = "Loading data...",
  tableId = "data-table",
  ariaLabel = "Data table",
  ariaLabelledBy,
  tableCaption,
  rowKey = "id",
  showRowNumbers = false,

  // Callbacks
  onRowClick,
  onSort,
  onPageChange,
  onSearch,
}) => {
  // ===== STATE =====
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // ===== REFS =====
  const previousDataRef = useRef(data);
  const previousSearchTermRef = useRef(searchTerm);

  // ===== DERIVED VALUES =====
  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter(row => 
      columns.some(column => {
        if (column.searchable === false) return false;
        const value = row[column.dataKey];
        return value != null && String(value).toLowerCase().includes(lowerSearchTerm);
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === "asc" ? 1 : -1;
      if (bValue == null) return sortConfig.direction === "asc" ? -1 : 1;

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      const comparison = aString.localeCompare(bString);
      
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig, sortable]);

  // Pagination calculations
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Paginate data - keeping endIndex for clarity
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;  // Keeping endIndex for readability
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  // Display calculations
  const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const startRowIndex = (currentPage - 1) * itemsPerPage;

  // ===== CLASS NAME GENERATION =====
  const tableClasses = [
    "data-table",
    striped && "striped",
    theme === "dark" && "dark-theme",
  ].filter(Boolean).join(" ");

  // ===== EVENT HANDLERS =====
  const handleSort = useCallback((key) => {
    if (!sortable) return;

    const newDirection = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction: newDirection });
    setCurrentPage(1);
    onSort?.(key, newDirection);
  }, [sortable, sortConfig.key, sortConfig.direction, onSort]);

  const handleKeyDown = useCallback((event, key) => {
    if (!sortable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSort(key);
    }
  }, [sortable, handleSort]);

  const handlePageSizeChange = useCallback((size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    onSearch?.(term);
  }, [onSearch]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  }, [onPageChange]);

  const handleRowClick = useCallback((row, event) => {
    onRowClick?.(row, event);
  }, [onRowClick]);

  // ===== EFFECTS =====
  // Reset page on data/search changes
  useEffect(() => {
    const dataChanged = previousDataRef.current !== data;
    const searchTermChanged = previousSearchTermRef.current !== searchTerm;

    previousDataRef.current = data;
    previousSearchTermRef.current = searchTerm;

    if (dataChanged || searchTermChanged) {
      requestAnimationFrame(() => setCurrentPage(1));
    }
  }, [data, searchTerm]);

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className={`${tableClasses} loading`} data-testid="data-table-loading">
        <div className="loading-spinner" />
        <p>{loadingMessage}</p>
      </div>
    );
  }

  const hasData = paginatedData.length > 0;

  // ===== RENDER =====
  return (
    <div 
      className={tableClasses} 
      data-testid="data-table" 
      data-theme={theme} 
      data-striped={striped} 
      data-sortable={sortable} 
      data-pagination={pagination} 
      data-has-data={hasData}
    >
      {/* Header Controls */}
      <div className="table-controls">
        {pagination && (
          <div className="pagination-controls">
            <PageSizeSelector value={itemsPerPage} onChange={handlePageSizeChange} />
          </div>
        )}
        {searchable && (
          <div className="search-control">
            <SearchBar value={searchTerm} onSearch={handleSearch} placeholder={searchPlaceholder} />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table
          id={tableId}
          role="table"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-rowcount={totalItems + 1}
          data-testid="data-table-content"
        >
          {tableCaption && <caption className="table-caption">{tableCaption}</caption>}
          
          <thead role="rowgroup">
            <tr role="row" aria-rowindex="1">
              {showRowNumbers && (
                <th
                  role="columnheader"
                  scope="col"
                  className="row-number-header"
                  style={{ width: "60px", textAlign: "center" }}
                  aria-label="Row number"
                >
                  #
                </th>
              )}
              
              {columns.map((column, index) => {
                const isSortable = column.sortable !== false && sortable;
                const isSorted = sortConfig.key === column.dataKey;
                const colIndex = index + 1 + (showRowNumbers ? 1 : 0);
                
                return (
                  <th
                    key={`${column.dataKey}-${index}`}
                    role="columnheader"
                    scope="col"
                    className={`
                      ${isSortable ? "sortable" : ""} 
                      ${isSorted ? "sorted" : ""} 
                      ${column.headerClassName || ""}
                    `}
                    style={{
                      width: column.width || "auto",
                      textAlign: column.align || "left",
                      ...column.headerStyle,
                    }}
                    onClick={() => isSortable && handleSort(column.dataKey)}
                    onKeyDown={(e) => isSortable && handleKeyDown(e, column.dataKey)}
                    tabIndex={isSortable ? 0 : -1}
                    aria-sort={isSorted ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"}
                    aria-label={`${column.title}${isSorted ? `, sorted ${sortConfig.direction}` : ""}`}
                    aria-colindex={colIndex}
                  >
                    <div className="header-content">
                      <span>{column.title}</span>
                      {isSortable && (
                        <span className="sort-indicator">
                          <span className="sort-arrow-wrapper">
                            <span className={`sort-arrow-up ${isSorted && sortConfig.direction === "asc" ? "active" : ""}`}>▲</span>
                            <span className={`sort-arrow-down ${isSorted && sortConfig.direction === "desc" ? "active" : ""}`}>▼</span>
                          </span>
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody role="rowgroup">
            {hasData ? (
              paginatedData.map((row, rowIndex) => {
                const absoluteRowIndex = startRowIndex + rowIndex + 2;
                const rowId = row[rowKey] || `row-${rowIndex}`;
                
                return (
                  <tr
                    key={rowId}
                    id={rowId}
                    role="row"
                    aria-rowindex={absoluteRowIndex}
                    className={`
                      ${onRowClick ? "clickable" : ""}
                      ${striped && rowIndex % 2 === 1 ? "even" : "odd"}
                      ${row.rowClassName || ""}
                    `}
                    onClick={(e) => onRowClick && handleRowClick(row, e)}
                    onKeyDown={(e) => {
                      if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleRowClick(row, e);
                      }
                    }}
                    tabIndex={onRowClick ? 0 : -1}
                    style={row.rowStyle}
                    aria-selected={row.selected || false}
                    aria-label={`Row ${absoluteRowIndex - 1}`}
                  >
                    {showRowNumbers && (
                      <td
                        role="cell"
                        aria-colindex="1"
                        className="row-number-cell"
                        style={{ textAlign: "center" }}
                      >
                        {startRowIndex + rowIndex + 1}
                      </td>
                    )}
                    
                    {columns.map((column, colIndex) => {
                      const cellIndex = colIndex + 1 + (showRowNumbers ? 1 : 0);
                      const cellValue = row[column.dataKey] ?? "";
                      
                      return (
                        <td
                          key={`${column.dataKey}-${rowIndex}-${colIndex}`}
                          role="cell"
                          aria-colindex={cellIndex}
                          aria-label={`${column.title}: ${cellValue}`}
                          className={typeof column.cellClassName === "function" ? column.cellClassName(row) : column.cellClassName || ""}
                          style={{
                            textAlign: column.align || "left",
                            ...(typeof column.cellStyle === "function" ? column.cellStyle(row) : column.cellStyle),
                          }}
                        >
                          {column.render ? column.render(cellValue, row, rowIndex) : cellValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr role="row" className={`empty-row ${searchTerm ? 'has-search' : 'no-search'}`}>
                <td role="cell" colSpan={columns.length + (showRowNumbers ? 1 : 0)} data-testid="data-table-empty">
                  <div className="empty-state">
                    <span className="empty-icon">📊</span>
                    <p>{emptyMessage}</p>
                    {searchTerm && <p className="empty-subtext">Try clearing your search</p>}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="table-footer">
        <div className="footer-left">
          <TableInfo totalItems={totalItems} startItem={startItem} endItem={endItem} />
        </div>
        {pagination && totalPages > 1 && (
          <div className="footer-right">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
};

// ===== PROP TYPES =====
DataTable.propTypes = {
  // Data
  data: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      searchable: PropTypes.bool,
      render: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      align: PropTypes.oneOf(['left', 'center', 'right']),
      headerClassName: PropTypes.string,
      headerStyle: PropTypes.object,
      cellClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      cellStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    })
  ),

  // Configuration
  itemsPerPage: PropTypes.number,
  searchable: PropTypes.bool,
  sortable: PropTypes.bool,
  pagination: PropTypes.bool,
  striped: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark']),

  // Customization
  searchPlaceholder: PropTypes.string,
  emptyMessage: PropTypes.string,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  tableId: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  tableCaption: PropTypes.string,
  rowKey: PropTypes.string,
  showRowNumbers: PropTypes.bool,

  // Callbacks
  onRowClick: PropTypes.func,
  onSort: PropTypes.func,
  onPageChange: PropTypes.func,
  onSearch: PropTypes.func
};

export default DataTable;