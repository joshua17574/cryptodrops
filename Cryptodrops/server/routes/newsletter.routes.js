import express from 'express';
import { subscribe, unsubscribe } from '../controllers/newsletter.controller.js';
import { validateNewsletterRules, handleValidationErrors } from '../middleware/validation.middleware.js';
import { createRateLimiter } from '../middleware/rate-limit.middleware.js';

const router = express.Router();

const newsletterRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  message: 'Too many subscription attempts, please try again later'
});

router.post('/subscribe', newsletterRateLimiter, validateNewsletterRules, handleValidationErrors, subscribe);
router.post('/unsubscribe', validateNewsletterRules, handleValidationErrors, unsubscribe);

export default router;
