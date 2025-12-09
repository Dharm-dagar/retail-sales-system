import React, { useState, useRef, useEffect } from 'react';

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const FilterDropdown = ({ 
  label, 
  options, 
  selected, 
  onChange,
  type = 'multi' // 'multi', 'dateRange', 'ageRange'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const isActive = selected.length > 0 || 
    (type === 'dateRange' && (selected.from || selected.to)) ||
    (type === 'ageRange' && (selected.min || selected.max));

  const getDisplayText = () => {
    if (type === 'multi') {
      if (selected.length === 0) return label;
      if (selected.length === 1) return selected[0];
      return `${label} (${selected.length})`;
    }
    if (type === 'dateRange') {
      if (!selected.from && !selected.to) return label;
      return label;
    }
    if (type === 'ageRange') {
      if (!selected.min && !selected.max) return label;
      return `${selected.min || 'Min'} - ${selected.max || 'Max'}`;
    }
    return label;
  };

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-trigger ${isActive ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {getDisplayText()}
        <ChevronDownIcon />
      </button>
      
      {isOpen && (
        <div className="filter-dropdown-menu">
          {type === 'multi' && options.map((option) => (
            <div
              key={option}
              className="filter-option"
              onClick={() => handleToggleOption(option)}
            >
              <div className={`filter-checkbox ${selected.includes(option) ? 'checked' : ''}`}>
                {selected.includes(option) && <CheckIcon />}
              </div>
              <span>{option}</span>
            </div>
          ))}
          
          {type === 'dateRange' && (
            <div className="date-range-inputs">
              <div className="date-input-group">
                <label className="date-input-label">From</label>
                <input
                  type="date"
                  className="date-input"
                  value={selected.from || ''}
                  onChange={(e) => onChange({ ...selected, from: e.target.value })}
                />
              </div>
              <div className="date-input-group">
                <label className="date-input-label">To</label>
                <input
                  type="date"
                  className="date-input"
                  value={selected.to || ''}
                  onChange={(e) => onChange({ ...selected, to: e.target.value })}
                />
              </div>
            </div>
          )}
          
          {type === 'ageRange' && (
            <div className="age-range-inputs">
              <input
                type="number"
                className="age-input"
                placeholder="Min"
                min="0"
                max="120"
                value={selected.min || ''}
                onChange={(e) => onChange({ ...selected, min: e.target.value })}
              />
              <span style={{ alignSelf: 'center', color: '#6b7280' }}>to</span>
              <input
                type="number"
                className="age-input"
                placeholder="Max"
                min="0"
                max="120"
                value={selected.max || ''}
                onChange={(e) => onChange({ ...selected, max: e.target.value })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
