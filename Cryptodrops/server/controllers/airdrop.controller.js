/**
 * Airdrop Controller
 * Handles HTTP requests for airdrop operations
 * Acts as a bridge between routes and services
 * 
 * @module controllers/airdrop.controller
 */

import { AirdropService } from '../services/airdrop.service.js';
import { EmailService } from '../services/email.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

const airdropService = new AirdropService();
const emailService = new EmailService();

/**
 * Get all airdrops from the database with optional pagination
 * @route GET /api/airdrops?page=1&limit=50
 * @access Public
 * @query {number} page - Page number (default: 1, min: 1)
 * @query {number} limit - Items per page (default: 100, min: 1, max: 500)
 * @returns {Promise<Object>} Object with airdrops array and pagination metadata
 */
export const getAllAirdrops = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(Math.min(parseInt(req.query.limit) || 100, 500), 1);
  const result = await airdropService.getAllAirdrops(page, limit);
  res.json(result);
});

/**
 * Get a single airdrop by ID
 * @route GET /api/airdrops/:id
 * @access Public
 * @param {string} req.params.id - Airdrop ID
 * @returns {Promise<Object>} Airdrop object
 * @throws {NotFoundError} If airdrop not found
 */
export const getAirdropById = asyncHandler(async (req, res) => {
  const airdrop = await airdropService.getAirdropById(req.params.id);
  res.json(airdrop);
});

/**
 * Create a new airdrop
 * @route POST /api/airdrops
 * @access Private (Admin only)
 * @param {Object} req.body - Airdrop data
 * @returns {Promise<Object>} Created airdrop object
 * @throws {ValidationError} If required fields are missing or invalid
 */
export const createAirdrop = asyncHandler(async (req, res) => {
  const airdrop = await airdropService.createAirdrop(req.body);
  
  try {
    const result = await emailService.sendNewAirdropNotification(airdrop);
    if (result) {
      if (result.sent > 0 && result.failed === 0) {
        console.log(`✅ Successfully notified all ${result.sent} subscribers about new airdrop: ${airdrop.name}`);
      } else if (result.sent > 0 && result.failed > 0) {
        console.warn(`⚠️  Partial notification success for ${airdrop.name}: ${result.sent} sent, ${result.failed} failed out of ${result.total} subscribers`);
      } else if (result.sent === 0 && result.total > 0) {
        console.error(`❌ Failed to notify all ${result.total} subscribers about new airdrop: ${airdrop.name}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error sending airdrop notification emails for ${airdrop.name}:`, error.message);
  }
  
  res.status(HTTP_STATUS.CREATED).json(airdrop);
});

/**
 * Update an existing airdrop
 * @route PUT /api/airdrops/:id
 * @access Private (Admin only)
 * @param {string} req.params.id - Airdrop ID
 * @param {Object} req.body - Updated airdrop data
 * @returns {Promise<Object>} Updated airdrop object
 * @throws {NotFoundError} If airdrop not found
 * @throws {ValidationError} If update data is invalid
 */
export const updateAirdrop = asyncHandler(async (req, res) => {
  const airdrop = await airdropService.updateAirdrop(req.params.id, req.body);
  res.json(airdrop);
});

/**
 * Delete an airdrop
 * @route DELETE /api/airdrops/:id
 * @access Private (Admin only)
 * @param {string} req.params.id - Airdrop ID
 * @returns {Promise<Object>} Success message
 * @throws {NotFoundError} If airdrop not found
 */
export const deleteAirdrop = asyncHandler(async (req, res) => {
  const result = await airdropService.deleteAirdrop(req.params.id);
  res.json(result);
});

/**
 * Get statistics for all airdrops
 * @route GET /api/stats
 * @access Public
 * @returns {Promise<Object>} Statistics object including total airdrops, active count, etc.
 */
export const getStats = asyncHandler(async (req, res) => {
  const stats = await airdropService.getStats();
  res.json(stats);
});
