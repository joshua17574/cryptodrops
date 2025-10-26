import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validateLoginRules, handleValidationErrors } from '../middleware/validation.middleware.js';
import { createRateLimiter } from '../middleware/rate-limit.middleware.js';

const router = express.Router();

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: 'Too many login attempts, please try again after 15 minutes'
});

// Public login endpoint
router.post('/login', authRateLimiter, validateLoginRules, handleValidationErrors, login);

/**
 * Registration endpoint - DISABLED for security
 * Admin users should be created via setup-admin.js script or environment variables
 * This prevents unauthorized admin account creation
 * 
 * To enable registration in development, set ENABLE_REGISTRATION=true in .env
 */
if (process.env.ENABLE_REGISTRATION === 'true') {
  console.warn('⚠️  WARNING: Public registration is enabled. This should ONLY be used in development!');
  router.post('/register', authRateLimiter, validateLoginRules, handleValidationErrors, register);
}

export default router;
