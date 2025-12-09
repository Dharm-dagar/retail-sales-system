/**
 * Filter utility functions for sales data
 * Handles all filtering logic in a centralized location
 */

/**
 * Apply search filter - case-insensitive search on customerName and phoneNumber
 */
export const applySearch = (data, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return data;
  
  const query = searchTerm.toLowerCase().trim();
  
  return data.filter(item => {
    // Define all searchable fields
    const searchableFields = [
      item.customerName,
      item.phoneNumber,
      item.transactionId,
      item.customerId,
      item.employeeName,
      item.productId
    ];

    return searchableFields.some(field => {
      if (!field) return false;
      
      const fieldValue = String(field).toLowerCase();
      
      // Split query into words
      const queryWords = query.split(/\s+/);
      
      // If searching for multiple words (like "neha yadav")
      if (queryWords.length > 1) {
        // Check if ALL query words match as complete words in the field
        const fieldWords = fieldValue.split(/\s+/);
        
        return queryWords.every(queryWord => {
          return fieldWords.some(fieldWord => 
            fieldWord === queryWord || fieldWord.startsWith(queryWord)
          );
        });
      }
      
      // For single word search, use word boundary matching
      // This ensures "neha" won't match "sneha"
      const fieldWords = fieldValue.split(/\s+/);
      
      // Check if any word in the field exactly matches or starts with the query
      return fieldWords.some(word => {
        // Exact match
        if (word === query) return true;
        
        // Word starts with query (for progressive typing like "neh" -> "neha")
        if (word.startsWith(query)) return true;
        
        return false;
      });
    });
  });
};

/**
 * Apply multi-select filters
 */
export const applyFilters = (data, filters) => {
  let filteredData = [...data];

  // Customer Region filter (multi-select)
  if (filters.customerRegion && filters.customerRegion.length > 0) {
    filteredData = filteredData.filter(item =>
      filters.customerRegion.includes(item.customerRegion)
    );
  }

  // Gender filter (multi-select)
  if (filters.gender && filters.gender.length > 0) {
    filteredData = filteredData.filter(item =>
      filters.gender.includes(item.gender)
    );
  }

  // Age Range filter
  if (filters.ageMin !== undefined && filters.ageMin !== null && filters.ageMin !== '') {
    const minAge = parseInt(filters.ageMin);
    if (!isNaN(minAge)) {
      filteredData = filteredData.filter(item => item.age >= minAge);
    }
  }
  
  if (filters.ageMax !== undefined && filters.ageMax !== null && filters.ageMax !== '') {
    const maxAge = parseInt(filters.ageMax);
    if (!isNaN(maxAge)) {
      filteredData = filteredData.filter(item => item.age <= maxAge);
    }
  }

  // Product Category filter (multi-select)
  if (filters.productCategory && filters.productCategory.length > 0) {
    filteredData = filteredData.filter(item =>
      filters.productCategory.includes(item.productCategory)
    );
  }

  // Tags filter (multi-select - item must have at least one matching tag)
  if (filters.tags && filters.tags.length > 0) {
    filteredData = filteredData.filter(item => {
      if (!item.tags || item.tags.length === 0) return false;
      return filters.tags.some(tag => item.tags.includes(tag));
    });
  }

  // Payment Method filter (multi-select)
  if (filters.paymentMethod && filters.paymentMethod.length > 0) {
    filteredData = filteredData.filter(item =>
      filters.paymentMethod.includes(item.paymentMethod)
    );
  }

  // Date Range filter
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    if (!isNaN(fromDate.getTime())) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date);
        return !isNaN(itemDate.getTime()) && itemDate >= fromDate;
      });
    }
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    if (!isNaN(toDate.getTime())) {
      // Set to end of day
      toDate.setHours(23, 59, 59, 999);
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date);
        return !isNaN(itemDate.getTime()) && itemDate <= toDate;
      });
    }
  }

  return filteredData;
};

/**
 * Apply sorting to data
 */
export const applySorting = (data, sortBy, sortOrder = 'asc') => {
  if (!sortBy) return data;

  const sortedData = [...data];
  const order = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

  sortedData.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return (dateB.getTime() - dateA.getTime()) * order; // Newest first by default
      
      case 'quantity':
        return (a.quantity - b.quantity) * order;
      
      case 'customerName':
        const nameA = (a.customerName || '').toLowerCase();
        const nameB = (b.customerName || '').toLowerCase();
        return nameA.localeCompare(nameB) * order;
      
      case 'finalAmount':
        return (a.finalAmount - b.finalAmount) * order;
      
      default:
        return 0;
    }
  });

  return sortedData;
};

/**
 * Apply pagination to data
 */
export const applyPagination = (data, page = 1, pageSize = 10) => {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
};

/**
 * Extract unique values for filter options
 */
export const extractFilterOptions = (data) => {
  const regions = new Set();
  const genders = new Set();
  const categories = new Set();
  const tags = new Set();
  const paymentMethods = new Set();
  let minAge = Infinity;
  let maxAge = -Infinity;

  data.forEach(item => {
    if (item.customerRegion) regions.add(item.customerRegion);
    if (item.gender) genders.add(item.gender);
    if (item.productCategory) categories.add(item.productCategory);
    if (item.paymentMethod) paymentMethods.add(item.paymentMethod);
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => tags.add(tag));
    }
    if (item.age && item.age > 0) {
      minAge = Math.min(minAge, item.age);
      maxAge = Math.max(maxAge, item.age);
    }
  });

  return {
    customerRegions: Array.from(regions).sort(),
    genders: Array.from(genders).sort(),
    productCategories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
    paymentMethods: Array.from(paymentMethods).sort(),
    ageRange: {
      min: minAge === Infinity ? 0 : minAge,
      max: maxAge === -Infinity ? 100 : maxAge,
    },
  };
};

export default {
  applySearch,
  applyFilters,
  applySorting,
  applyPagination,
  extractFilterOptions,
};
