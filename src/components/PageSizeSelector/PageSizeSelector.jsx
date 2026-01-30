import React, { useState, useRef, useEffect } from 'react';
import './PageSizeSelector.scss';

const PageSizeSelector = ({
  value,
  onChange,
  options = [5, 10, 25, 50, 100],
  size = 'medium',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue) => {
    if (!disabled && onChange && optionValue !== value) {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  // Basic keyboard navigation
  const handleKeyDown = (event) => {
    if (disabled) return;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      default:
        break;
    }
  };

  const sizeClass = {
    small: 'size-small',
    medium: '',
    large: 'size-large'
  }[size];

  const triggerClasses = [
    'page-size-selector__trigger',
    isOpen ? 'page-size-selector__trigger--open' : '',
    disabled ? 'page-size-selector__trigger--disabled' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={`page-size-selector ${sizeClass}`}
      data-testid="page-size-selector"
    >
      <span className="page-size-selector__label">
        Show
      </span>
      <div 
        ref={wrapperRef}
        className="page-size-selector__wrapper"
      >
        <button
          type="button"
          className={triggerClasses}
          onClick={handleTriggerClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Show ${value} entries per page`}
          data-testid="page-size-trigger"
        >
          {value}
          <span className="page-size-selector__arrow" aria-hidden="true">
            ▼
          </span>
        </button>
        
        {isOpen && !disabled && (
          <div 
            className="page-size-selector__options"
            role="listbox"
            aria-label="Number of entries to show"
            data-testid="page-size-options"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className={`page-size-selector__option ${
                  option === value ? 'page-size-selector__option--selected' : ''
                }`}
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={option === value}
                data-testid={`page-size-option-${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
      <span className="page-size-selector__label">
        entries
      </span>
    </div>
  );
};

export default PageSizeSelector;