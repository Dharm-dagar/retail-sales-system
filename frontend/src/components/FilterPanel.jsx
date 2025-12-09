import React from 'react';
import FilterDropdown from './FilterDropdown';

const ResetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"></polyline>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
  </svg>
);

const FilterPanel = ({ 
  filters,
  filterOptions, 
  onFilterChange, 
  onReset,
  sort,
  onSortChange
}) => {
  return (
    <div className="filters-section">
      <button 
        className="filter-reset-btn" 
        onClick={onReset}
        title="Reset all filters"
      >
        <ResetIcon />
      </button>
      
      <FilterDropdown
        label="Customer Region"
        options={filterOptions.customerRegions}
        selected={filters.customerRegion}
        onChange={(value) => onFilterChange('customerRegion', value)}
        type="multi"
      />
      
      <FilterDropdown
        label="Gender"
        options={filterOptions.genders}
        selected={filters.gender}
        onChange={(value) => onFilterChange('gender', value)}
        type="multi"
      />
      
      <FilterDropdown
        label="Age Range"
        options={[]}
        selected={{ min: filters.ageMin, max: filters.ageMax }}
        onChange={(value) => {
          onFilterChange('ageMin', value.min);
          onFilterChange('ageMax', value.max);
        }}
        type="ageRange"
      />
      
      <FilterDropdown
        label="Product Category"
        options={filterOptions.productCategories}
        selected={filters.productCategory}
        onChange={(value) => onFilterChange('productCategory', value)}
        type="multi"
      />
      
      <FilterDropdown
        label="Tags"
        options={filterOptions.tags}
        selected={filters.tags}
        onChange={(value) => onFilterChange('tags', value)}
        type="multi"
      />
      
      <FilterDropdown
        label="Payment Method"
        options={filterOptions.paymentMethods}
        selected={filters.paymentMethod}
        onChange={(value) => onFilterChange('paymentMethod', value)}
        type="multi"
      />
      
      <FilterDropdown
        label="Date"
        options={[]}
        selected={{ from: filters.dateFrom, to: filters.dateTo }}
        onChange={(value) => {
          onFilterChange('dateFrom', value.from);
          onFilterChange('dateTo', value.to);
        }}
        type="dateRange"
      />
      
      <div className="sort-container">
        <span className="sort-label">Sort by:</span>
        <select 
          className="sort-select"
          value={`${sort.sortBy}-${sort.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onSortChange(sortBy, sortOrder);
          }}
        >
          <option value="customerName-asc">Customer Name (A-Z)</option>
          <option value="customerName-desc">Customer Name (Z-A)</option>
          <option value="date-desc">Date (Newest First)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="quantity-desc">Quantity (High to Low)</option>
          <option value="quantity-asc">Quantity (Low to High)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
