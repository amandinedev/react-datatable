import React, { useState, useEffect } from 'react';
import './SearchBar.scss';

const SearchBar = ({
  value = '',
  onSearch,
  placeholder = 'Search...',
  label = 'Search',
  showLabel = true,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync local state with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onSearch(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`search-bar ${className}`}>
      {showLabel && label && (
        <label className="search-label" htmlFor="search-input">
          {label}
        </label>
      )}
      <div className="search-input-wrapper">
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label={label || "Search"}
        />
        {localValue && (
          <button
            className="search-clear"
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

SearchBar.defaultProps = {
  value: '',
  placeholder: 'Search...',
  label: 'Search:',
  showLabel: true,
  className: ''
};

export default SearchBar;