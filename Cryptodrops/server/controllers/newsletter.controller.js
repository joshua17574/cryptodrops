/**
 * Newsletter Controller
 * Handles HTTP requests for newsletter operations
 * 
 * @module controllers/newsletter.controller
 */

import { NewsletterService } from '../services/newsletter.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

const newsletterService = new NewsletterService();

/**
 * Subscribe to newsletter
 * @route POST /api/newsletter/subscribe
 * @access Public
 * @param {string} req.body.email - Subscriber email
 * @returns {Promise<Object>} Subscription confirmation
 */
export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await newsletterService.subscribe(email);
  res.status(HTTP_STATUS.CREATED).json(result);
});

/**
 * Unsubscribe from newsletter
 * @route POST /api/newsletter/unsubscribe
 * @access Public
 * @param {string} req.body.email - Subscriber email
 * @returns {Promise<Object>} Unsubscribe confirmation
 */
export const unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await newsletterService.unsubscribe(email);
  res.json(result);
});
