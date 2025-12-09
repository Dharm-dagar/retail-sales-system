import { Router } from 'express';
import {
  getSales,
  getFilters,
  getTransaction,
  getStats,
} from '../controllers/salesController.js';

const router = Router();

// GET /api/sales - Get paginated sales with search, filter, sort
router.get('/', getSales);

// GET /api/sales/filters - Get filter options for dropdowns
router.get('/filters', getFilters);

// GET /api/sales/stats - Get basic statistics
router.get('/stats', getStats);

// GET /api/sales/:id - Get single transaction by ID
router.get('/:id', getTransaction);

export default router;
