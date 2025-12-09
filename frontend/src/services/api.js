const API_BASE = '/api';

/**
 * Helper function to make fetch requests with retry logic
 */
const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      // If response is not ok but we got a response, throw to trigger retry
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Fetch sales data with all query parameters
 */
export const fetchSalesData = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add search term
  if (params.search) {
    queryParams.append('search', params.search);
  }
  
  // Add multi-select filters
  if (params.customerRegion?.length) {
    queryParams.append('customerRegion', params.customerRegion.join(','));
  }
  if (params.gender?.length) {
    queryParams.append('gender', params.gender.join(','));
  }
  if (params.productCategory?.length) {
    queryParams.append('productCategory', params.productCategory.join(','));
  }
  if (params.tags?.length) {
    queryParams.append('tags', params.tags.join(','));
  }
  if (params.paymentMethod?.length) {
    queryParams.append('paymentMethod', params.paymentMethod.join(','));
  }
  
  // Add range filters
  if (params.ageMin !== undefined && params.ageMin !== '') {
    queryParams.append('ageMin', params.ageMin);
  }
  if (params.ageMax !== undefined && params.ageMax !== '') {
    queryParams.append('ageMax', params.ageMax);
  }
  if (params.dateFrom) {
    queryParams.append('dateFrom', params.dateFrom);
  }
  if (params.dateTo) {
    queryParams.append('dateTo', params.dateTo);
  }
  
  // Add sorting
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
    queryParams.append('sortOrder', params.sortOrder || 'asc');
  }
  
  // Add pagination
  queryParams.append('page', params.page || 1);
  queryParams.append('pageSize', params.pageSize || 10);
  
  const response = await fetchWithRetry(`${API_BASE}/sales?${queryParams.toString()}`);
  
  return response.json();
};

/**
 * Fetch available filter options
 */
export const fetchFilterOptions = async () => {
  const response = await fetchWithRetry(`${API_BASE}/sales/filters`);
  
  return response.json();
};

/**
 * Fetch single transaction by ID
 */
export const fetchTransaction = async (id) => {
  const response = await fetchWithRetry(`${API_BASE}/sales/${id}`);
  
  return response.json();
};

/**
 * Health check
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

export default {
  fetchSalesData,
  fetchFilterOptions,
  fetchTransaction,
  checkHealth,
};
