import express from 'express';
import {
  getAllAirdrops,
  getAirdropById,
  createAirdrop,
  updateAirdrop,
  deleteAirdrop,
  getStats
} from '../controllers/airdrop.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { 
  validateAirdropRules, 
  handleValidationErrors 
} from '../middleware/validation.middleware.js';
import { createRateLimiter } from '../middleware/rate-limit.middleware.js';
import { invalidateCache, cacheMiddleware } from '../middleware/cache.middleware.js';

const router = express.Router();

/**
 * Rate limiter for mutation operations (POST, PUT, DELETE)
 * Prevents abuse and ensures API stability
 */
const mutationRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20,
  message: 'Too many requests, please slow down'
});

/**
 * Cache patterns to invalidate when airdrops are modified
 * Invalidates stats and airdrops list cache
 */
const cacheInvalidationPatterns = ['cache:/api/stats', 'cache:/api/airdrops'];

// Read operations - with caching for performance
router.get('/', cacheMiddleware(180), getAllAirdrops); // Cache for 3 minutes
router.get('/stats', getStats); // Stats endpoint already cached in server/index.js
router.get('/:id', getAirdropById); // Individual airdrops don't need caching

// Write operations - require admin role and invalidate cache after successful mutations
// Security: Only authenticated users with admin role can create, update, or delete airdrops
// Note: invalidateCache must be BEFORE controller to wrap res.json
router.post('/', 
  mutationRateLimiter, 
  authenticateToken,
  requireAdmin,
  validateAirdropRules,
  handleValidationErrors,
  invalidateCache(cacheInvalidationPatterns),
  createAirdrop
);

router.put('/:id', 
  mutationRateLimiter, 
  authenticateToken,
  requireAdmin,
  validateAirdropRules,
  handleValidationErrors,
  invalidateCache(cacheInvalidationPatterns),
  updateAirdrop
);

router.delete('/:id', 
  mutationRateLimiter, 
  authenticateToken,
  requireAdmin,
  invalidateCache(cacheInvalidationPatterns),
  deleteAirdrop
);

export default router;
