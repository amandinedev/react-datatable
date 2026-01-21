import React from 'react';
import './PageSizeSelector.scss';

const PageSizeSelector = ({
  value,
  onChange,
  options = [5, 10, 25, 50, 100],
  size = 'medium' // 'small' | 'medium' | 'large'
}) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div 
      className={`page-size-selector size-${size}`}
      data-testid="page-size-selector"
    >
      <span className="page-size-selector__label">
        Show
      </span>
      <div className="page-size-selector__wrapper">
        <select
          className="page-size-selector__select"
          value={value}
          onChange={handleChange}
          aria-label="Number of entries to show"
          data-testid="page-size-select"
        >
          {options.map(option => (
            <option 
              key={option} 
              value={option}
              data-testid={`page-size-option-${option}`}
            >
              {option}
            </option>
          ))}
        </select>
        <span className="page-size-selector__arrow" aria-hidden="true">
          ▼
        </span>
      </div>
      <span className="page-size-selector__label">
        entries
      </span>
    </div>
  );
};

export default PageSizeSelector;