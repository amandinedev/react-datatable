import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.scss';

const SearchBar = ({
  value = '',
  onSearch,
  placeholder = 'Search...',
  label = 'Search',
  showLabel = true,
  className = ''
}) => {
  // ===== STATE =====
  const [localValue, setLocalValue] = useState(value);

  // ===== EFFECTS =====
  // Sync local state with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // ===== EVENT HANDLERS =====
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onSearch(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onSearch('');
  };

  // ===== RENDER =====
  return (
    <div className={`search-bar ${className}`}>
      {showLabel && (
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
          onKeyDown={(e) => e.key === 'Escape' && handleClear()}
          aria-label={label}
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

// ===== PROP TYPES =====
SearchBar.propTypes = {
  value: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  showLabel: PropTypes.bool,
  className: PropTypes.string
};

export default SearchBar;