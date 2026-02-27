import { useState, useRef, useEffect } from "react";
import "./PageSizeSelector.scss";

/**
 * A customizable dropdown selector for choosing the number of items to display per page
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.value - Currently selected page size value
 * @param {function(number): void} props.onChange - Callback function when page size changes
 * @param {number[]} [props.options=[5, 10, 25, 50, 100]] - Array of available page size options
 * @param {'small' | 'medium' | 'large'} [props.size='medium'] - Size variant of the selector
 * @param {boolean} [props.disabled=false] - Whether the selector is disabled
 *
 * @returns {JSX.Element} Rendered page size selector
 */

const PageSizeSelector = ({
  value,
  onChange,
  options = [5, 10, 25, 50, 100],
  size = "medium",
  disabled = false,
}) => {
  // ===== STATE & REFS =====
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const optionsRef = useRef([]);

  // ===== EFFECTS =====
  // Reset optionsRef when options change
  useEffect(() => {
    optionsRef.current = optionsRef.current.slice(0, options.length);
  }, [options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  // Focus first option when opening
  useEffect(() => {
    if (isOpen && optionsRef.current[0]) {
      setTimeout(() => {
        optionsRef.current[0]?.focus();
      }, 0);
    }
  }, [isOpen]);

  // ===== HELPER FUNCTIONS =====
  const moveFocus = (direction) => {
    const currentIndex = optionsRef.current.findIndex(
      (option) => option === document.activeElement,
    );

    let nextIndex;
    if (currentIndex === -1) {
      nextIndex = direction > 0 ? 0 : optionsRef.current.length - 1;
    } else {
      nextIndex = currentIndex + direction;
      if (nextIndex < 0) nextIndex = optionsRef.current.length - 1;
      if (nextIndex >= optionsRef.current.length) nextIndex = 0;
    }

    optionsRef.current[nextIndex]?.focus();
  };

  // ===== EVENT HANDLERS =====
  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue) => {
    if (!disabled && onChange && optionValue !== value) {
      onChange(optionValue);
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleTriggerKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (event.key === "ArrowDown") {
          moveFocus(1);
        } else if (event.key === "ArrowUp") {
          moveFocus(-1);
        }
        break;

      case "Tab":
        if (isOpen) {
          setIsOpen(false);
        }
        break;

      default:
        break;
    }
  };

  const handleOptionKeyDown = (event, optionValue) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleOptionClick(optionValue);
        break;

      case "ArrowDown":
        event.preventDefault();
        moveFocus(1);
        break;

      case "ArrowUp":
        event.preventDefault();
        moveFocus(-1);
        break;

      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      case "Tab":
        setIsOpen(false);
        break;

      default:
        break;
    }
  };

  // ===== CLASS NAME GENERATION =====
  const sizeClass = {
    small: "size-small",
    medium: "",
    large: "size-large",
  }[size];

  const triggerClasses = [
    "page-size-selector__trigger",
    isOpen ? "page-size-selector__trigger--open" : "",
    disabled ? "page-size-selector__trigger--disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ===== RENDER =====
  return (
    <div
      className={`page-size-selector ${sizeClass}`}
      data-testid="page-size-selector"
    >
      <span className="page-size-selector__label">Show</span>
      <div ref={wrapperRef} className="page-size-selector__wrapper">
        <button
          ref={triggerRef}
          type="button"
          className={triggerClasses}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
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
            data-testid="page-size-options"
          >
            {options.map((option, index) => (
              <button
                key={option}
                ref={(el) => (optionsRef.current[index] = el)}
                type="button"
                className={`page-size-selector__option ${
                  option === value ? "page-size-selector__option--selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                role="option"
                aria-selected={option === value}
                data-testid={`page-size-option-${option}`}
                tabIndex={-1}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
      <span className="page-size-selector__label">entries</span>
    </div>
  );
};

export default PageSizeSelector;
