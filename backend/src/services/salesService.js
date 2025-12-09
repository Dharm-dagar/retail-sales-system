// backend/src/services/salesService.js
import { getDB } from '../config/database.js';

/**
 * Build MongoDB query with exact word matching for search
 */
const buildSearchQuery = (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return {};

  const query = searchTerm.toLowerCase().trim();
  const queryWords = query.split(/\s+/);

  if (queryWords.length === 1) {
    // Single word - exact word boundary matching using regex
    const wordBoundaryRegex = new RegExp(`\\b${queryWords[0]}`, 'i');
    return {
      $or: [
        { customerName: wordBoundaryRegex },
        { phoneNumber: wordBoundaryRegex },
        { transactionId: wordBoundaryRegex },
        { customerId: wordBoundaryRegex },
        { employeeName: wordBoundaryRegex },
        { productId: wordBoundaryRegex }
      ]
    };
  } else {
    // Multiple words - all words must match as complete words
    const conditions = queryWords.map(word => {
      const wordBoundaryRegex = new RegExp(`\\b${word}`, 'i');
      return {
        $or: [
          { customerName: wordBoundaryRegex },
          { phoneNumber: wordBoundaryRegex },
          { transactionId: wordBoundaryRegex },
          { customerId: wordBoundaryRegex },
          { employeeName: wordBoundaryRegex },
          { productId: wordBoundaryRegex }
        ]
      };
    });
    return { $and: conditions };
  }
};

/**
 * Build MongoDB filter query
 */
const buildFilterQuery = (filters) => {
  const query = {};

  if (filters.customerRegion?.length > 0) {
    query.customerRegion = { $in: filters.customerRegion };
  }

  if (filters.gender?.length > 0) {
    query.gender = { $in: filters.gender };
  }

  if (filters.productCategory?.length > 0) {
    query.productCategory = { $in: filters.productCategory };
  }

  if (filters.tags?.length > 0) {
    query.tags = { $in: filters.tags };
  }

  if (filters.paymentMethod?.length > 0) {
    query.paymentMethod = { $in: filters.paymentMethod };
  }

  if (filters.ageMin) {
    query.age = { ...query.age, $gte: parseInt(filters.ageMin) };
  }

  if (filters.ageMax) {
    query.age = { ...query.age, $lte: parseInt(filters.ageMax) };
  }

  if (filters.dateFrom) {
    query.date = { ...query.date, $gte: filters.dateFrom };
  }

  if (filters.dateTo) {
    query.date = { ...query.date, $lte: filters.dateTo };
  }

  return query;
};

/**
 * Parse array parameters from query string
 */
const parseArrayParam = (param) => {
  if (!param) return [];
  if (Array.isArray(param)) return param;
  return param.split(',').map((s) => s.trim()).filter(Boolean);
};

/**
 * Get sales data with search, filters, sorting, and pagination
 */
export const getSalesData = async (params) => {
  const db = getDB();
  const collection = db.collection('sales');

  const {
    search,
    customerRegion,
    gender,
    ageMin,
    ageMax,
    productCategory,
    tags,
    paymentMethod,
    dateFrom,
    dateTo,
    sortBy = 'date',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
  } = params;

  // Build query
  const searchQuery = buildSearchQuery(search);
  const filterQuery = buildFilterQuery({
    customerRegion: parseArrayParam(customerRegion),
    gender: parseArrayParam(gender),
    ageMin,
    ageMax,
    productCategory: parseArrayParam(productCategory),
    tags: parseArrayParam(tags),
    paymentMethod: parseArrayParam(paymentMethod),
    dateFrom,
    dateTo,
  });

  const finalQuery = { ...searchQuery, ...filterQuery };

  // Get total count
  const totalItems = await collection.countDocuments(finalQuery);

  // Calculate summary
  const summaryPipeline = [
    { $match: finalQuery },
    {
      $group: {
        _id: null,
        totalUnitsSold: { $sum: '$quantity' },
        totalAmount: { $sum: '$totalAmount' },
        totalFinalAmount: { $sum: '$finalAmount' },
      },
    },
  ];

  const summaryResult = await collection.aggregate(summaryPipeline).toArray();
  const summary = summaryResult[0] || {
    totalUnitsSold: 0,
    totalAmount: 0,
    totalFinalAmount: 0,
  };

  summary.totalDiscount = summary.totalAmount - summary.totalFinalAmount;
  summary.recordCount = totalItems;

  // Build sort object
  const sortObj = {};
  if (sortBy === 'date') {
    sortObj.date = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'customerName') {
    sortObj.customerName = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'quantity') {
    sortObj.quantity = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'finalAmount') {
    sortObj.finalAmount = sortOrder === 'asc' ? 1 : -1;
  }

  // Get paginated data
  const pageNum = parseInt(page);
  const pageSizeNum = parseInt(pageSize);
  const skip = (pageNum - 1) * pageSizeNum;

  const data = await collection
    .find(finalQuery)
    .sort(sortObj)
    .skip(skip)
    .limit(pageSizeNum)
    .toArray();

  // Remove MongoDB _id from results
  const cleanData = data.map(({ _id, ...rest }) => rest);

  return {
    data: cleanData,
    summary,
    pagination: {
      currentPage: pageNum,
      pageSize: pageSizeNum,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSizeNum),
      hasNextPage: pageNum < Math.ceil(totalItems / pageSizeNum),
      hasPrevPage: pageNum > 1,
    },
  };
};

/**
 * Get filter options for dropdowns
 */
export const getFilterOptions = async () => {
  const db = getDB();
  const collection = db.collection('sales');

  const [
    regions,
    genders,
    categories,
    tags,
    paymentMethods,
    ageRange
  ] = await Promise.all([
    collection.distinct('customerRegion'),
    collection.distinct('gender'),
    collection.distinct('productCategory'),
    collection.distinct('tags'),
    collection.distinct('paymentMethod'),
    collection.aggregate([
      {
        $group: {
          _id: null,
          minAge: { $min: '$age' },
          maxAge: { $max: '$age' }
        }
      }
    ]).toArray()
  ]);

  return {
    customerRegions: regions.filter(Boolean).sort(),
    genders: genders.filter(Boolean).sort(),
    productCategories: categories.filter(Boolean).sort(),
    tags: tags.filter(Boolean).sort(),
    paymentMethods: paymentMethods.filter(Boolean).sort(),
    ageRange: {
      min: ageRange[0]?.minAge || 0,
      max: ageRange[0]?.maxAge || 100
    }
  };
};

/**
 * Get a single transaction by ID
 */
export const getTransactionById = async (transactionId) => {
  const db = getDB();
  const collection = db.collection('sales');
  const transaction = await collection.findOne({ transactionId });
  
  if (transaction) {
    const { _id, ...rest } = transaction;
    return rest;
  }
  
  return null;
};

/**
 * Get data count
 */
export const getDataCount = async () => {
  const db = getDB();
  const collection = db.collection('sales');
  return await collection.countDocuments();
};

export default {
  getSalesData,
  getFilterOptions,
  getTransactionById,
  getDataCount,
};