// backend/src/controllers/salesController.js
import {
  getSalesData,
  getFilterOptions,
  getTransactionById,
  getDataCount,
} from '../services/salesService.js';

/**
 * Get sales data with search, filters, sorting, and pagination
 * GET /api/sales
 */
export const getSales = async (req, res) => {
  try {
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
      sortBy,
      sortOrder,
      page,
      pageSize,
    } = req.query;

    const result = await getSalesData({
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
      sortBy,
      sortOrder,
      page: page || 1,
      pageSize: pageSize || 10,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sales data',
      message: error.message,
    });
  }
};

/**
 * Get filter options for dropdowns
 * GET /api/sales/filters
 */
export const getFilters = async (req, res) => {
  try {
    const options = await getFilterOptions();
    res.json({
      success: true,
      data: options,
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch filter options',
      message: error.message,
    });
  }
};

/**
 * Get a single transaction by ID
 * GET /api/sales/:id
 */
export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await getTransactionById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction',
      message: error.message,
    });
  }
};

/**
 * Get data statistics
 * GET /api/sales/stats
 */
export const getStats = async (req, res) => {
  try {
    const count = await getDataCount();
    res.json({
      success: true,
      data: {
        totalRecords: count,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message,
    });
  }
};

export default {
  getSales,
  getFilters,
  getTransaction,
  getStats,
};