import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import PageSizeSelector from '../PageSizeSelector/PageSizeSelector';
import Pagination from '../Pagination/Pagination';
import TableInfo from '../TableInfo/TableInfo';
import './DataTable.scss';

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
  compact = false,
  theme = 'light',
  responsive = false,
  
  // Customization
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  loading = false,
  loadingMessage = 'Loading data...',
  
  // Callbacks
  onRowClick,
  onSort,
  onPageChange,
  onSearch,
  
  // Custom renderers
  renderLoading,
  renderEmpty,
  renderHeader,
  renderFooter
}) => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // Track previous values to detect changes
  const previousDataRef = useRef(data);
  const previousSearchTermRef = useRef(searchTerm);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter(row => {
      return columns.some(column => {
        const value = row[column.dataKey];
        if (value == null) return false;
        
        if (column.searchable === false) return false;
        
        return String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortable) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      
      // Handle string comparison
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      if (aString < bString) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aString > bString) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, sortable]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  // Calculate totals
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Prepare column labels for responsive mode
  const columnLabels = useMemo(() => {
    if (!responsive) return null;
    return columns.reduce((acc, column) => {
      acc[column.dataKey] = column.title;
      return acc;
    }, {});
  }, [responsive, columns]);

  // Handlers
  const handleSort = useCallback((key) => {
    if (!sortable) return;
    
    const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const newSortConfig = {
      key,
      direction: newDirection
    };
    
    setSortConfig(newSortConfig);
    setCurrentPage(1);
    
    if (onSort) {
      onSort(key, newDirection);
    }
  }, [sortable, onSort, sortConfig.key, sortConfig.direction]);

  const handlePageSizeChange = useCallback((size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    
    if (onSearch) {
      onSearch(term);
    }
  }, [onSearch]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    
    if (onPageChange) {
      onPageChange(page);
    }
  }, [onPageChange]);

  const handleRowClick = useCallback((row, event) => {
    if (onRowClick) {
      onRowClick(row, event);
    }
  }, [onRowClick]);

  // Use an effect to reset page when data changes, but only if it's a meaningful change
  useEffect(() => {
    const dataChanged = previousDataRef.current !== data;
    const searchTermChanged = previousSearchTermRef.current !== searchTerm;
    
    // Update refs for next comparison
    previousDataRef.current = data;
    previousSearchTermRef.current = searchTerm;
    
    // Only reset page if there was a meaningful change
    if (dataChanged || searchTermChanged) {
      // Use requestAnimationFrame to avoid synchronous state updates in effect
      requestAnimationFrame(() => {
        setCurrentPage(1);
      });
    }
  }, [data, searchTerm]);

  // Determine CSS classes
  const tableClasses = [
    'data-table',
    striped && 'striped',
    compact && 'compact',
    responsive && 'responsive',
    theme === 'dark' && 'dark-theme'
  ].filter(Boolean).join(' ');

  // Render loading state
  if (loading) {
    if (renderLoading) {
      return renderLoading();
    }
    
    return (
      <div className={`${tableClasses} loading`}>
        <div className="loading-spinner"></div>
        <p>{loadingMessage}</p>
      </div>
    );
  }

  // Check if there's data to display
  const hasData = paginatedData.length > 0;

  return (
    <div className={tableClasses} data-testid="data-table">
      {/* Header Controls */}
      <div className="table-controls">
        <div className="pagination-controls">
          <PageSizeSelector
            value={itemsPerPage}
            onChange={handlePageSizeChange}
            size={compact ? 'small' : 'medium'}
          />
        </div>
        
        {searchable && (
          <div className="search-control">
            <SearchBar
              value={searchTerm}
              onSearch={handleSearch}
              placeholder={searchPlaceholder}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table data-testid="data-table-content">
          {renderHeader ? (
            renderHeader(columns, sortConfig, handleSort)
          ) : (
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={`${column.dataKey}-${index}`}
                    className={`
                      ${column.sortable !== false && sortable ? 'sortable' : ''}
                      ${sortConfig.key === column.dataKey ? 'sorted' : ''}
                    `}
                    style={{
                      width: column.width || 'auto',
                      textAlign: column.align || 'left',
                      ...column.headerStyle
                    }}
                    onClick={() => (column.sortable !== false && sortable) && handleSort(column.dataKey)}
                    title={(column.sortable !== false && sortable) ? `Sort by ${column.title}` : ''}
                  >
                    <div className="header-content">
                      <span>{column.title}</span>
                      {column.sortable !== false && sortable && (
                        <span className="sort-indicator">
                          {sortConfig.key === column.dataKey ? (
                            sortConfig.direction === 'asc' ? '↑' : '↓'
                          ) : '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {hasData ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={`
                    ${onRowClick ? 'clickable' : ''}
                    ${rowIndex % 2 === 1 ? 'even' : 'odd'}
                    ${row.rowClassName || ''}
                  `}
                  onClick={(e) => onRowClick && handleRowClick(row, e)}
                  style={row.rowStyle}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${column.dataKey}-${rowIndex}-${colIndex}`}
                      data-label={responsive && columnLabels ? columnLabels[column.dataKey] : undefined}
                      className={`
                        ${typeof column.cellClassName === 'function' 
                          ? column.cellClassName(row) 
                          : column.cellClassName || ''
                        }
                      `}
                      style={{
                        textAlign: column.align || 'left',
                        ...(typeof column.cellStyle === 'function'
                          ? column.cellStyle(row)
                          : column.cellStyle
                        )
                      }}
                    >
                      {column.render
                        ? column.render(row[column.dataKey], row, rowIndex)
                        : row[column.dataKey] ?? ''}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan={columns.length} data-testid="data-table-empty">
                  {renderEmpty ? (
                    renderEmpty(searchTerm)
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">📊</span>
                      <p>{emptyMessage}</p>
                      {searchTerm && (
                        <p className="empty-subtext">Try clearing your search</p>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="table-footer">
        {renderFooter ? (
          renderFooter({
            currentPage,
            itemsPerPage,
            totalItems,
            startItem,
            endItem,
            totalPages
          })
        ) : (
          <>
            <div className="footer-left">
              <TableInfo
                totalItems={totalItems}
                startItem={startItem}
                endItem={endItem}
              />
            </div>
            
            {pagination && totalPages > 1 && (
              <div className="footer-right">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

DataTable.defaultProps = {
  data: [],
  columns: [],
  itemsPerPage: 10,
  searchable: true,
  sortable: true,
  pagination: true,
  striped: false,
  compact: false,
  responsive: false,
  theme: 'light',
  searchPlaceholder: 'Search...',
  emptyMessage: 'No data available',
  loading: false,
  loadingMessage: 'Loading data...'
};

export default DataTable;