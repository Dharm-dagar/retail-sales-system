import React, { useState, useCallback } from 'react';
import { debounce } from '../utils/formatters';

const SearchIcon = () => (
  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const SearchBar = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      onChange(searchTerm);
    }, 300),
    [onChange]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <div className="search-container">
      <SearchIcon />
      <input
        type="text"
        className="search-input"
        placeholder="Name, Phone no."
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
