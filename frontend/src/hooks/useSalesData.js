import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSalesData, fetchFilterOptions } from '../services/api';

const initialFilters = {
  search: '',
  customerRegion: [],
  gender: [],
  ageMin: '',
  ageMax: '',
  productCategory: [],
  tags: [],
  paymentMethod: [],
  dateFrom: '',
  dateTo: '',
};

const initialSort = {
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useSalesData = () => {
  // Data state
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  
  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    customerRegions: [],
    genders: [],
    productCategories: [],
    tags: [],
    paymentMethods: [],
    ageRange: { min: 0, max: 100 },
  });
  
  // Current filters and sort
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Track if initial load is complete
  const initialLoadRef = useRef(false);

  // Fetch filter options on mount with retry
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await fetchFilterOptions();
        if (response.success) {
          setFilterOptions(response.data);
        }
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    
    loadFilterOptions();
  }, []);

  // Fetch data when filters, sort, or page changes
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchSalesData({
        ...filters,
        ...sort,
        page,
        pageSize: 10,
      });
      
      if (response.success) {
        setData(response.data);
        setSummary(response.summary);
        setPagination(response.pagination);
        initialLoadRef.current = true;
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update search
  const setSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPage(1);
  }, []);

  // Update a specific filter
  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setPage(1);
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
  }, []);

  // Update sorting
  const updateSort = useCallback((sortBy, sortOrder = 'asc') => {
    setSort({ sortBy, sortOrder });
    setPage(1);
  }, []);

  // Pagination handlers
  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [pagination.hasNextPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setPage(prev => prev - 1);
    }
  }, [pagination.hasPrevPage]);

  return {
    // Data
    data,
    summary,
    pagination,
    filterOptions,
    
    // Current state
    filters,
    sort,
    page,
    
    // Status
    loading,
    error,
    
    // Actions
    setSearch,
    updateFilter,
    resetFilters,
    updateSort,
    goToPage,
    nextPage,
    prevPage,
    refresh: loadData,
  };
};

export default useSalesData;
