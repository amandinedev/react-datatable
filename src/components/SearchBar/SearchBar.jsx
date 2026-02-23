import { useState, useEffect } from 'react';
import './SearchBar.scss';

/**
 * A search input component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.value=''] - Controlled search value
 * @param {function(string): void} props.onSearch - Callback function when search term changes
 * @param {string} [props.placeholder='Search...'] - Placeholder text for the input
 * @param {string} [props.label='Search'] - Label text for the search input
 * @param {boolean} [props.showLabel=true] - Whether to display the label
 * @param {string} [props.className=''] - Additional CSS class names
 * 
 * @returns {JSX.Element} Rendered search bar
 */

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

export default SearchBar;