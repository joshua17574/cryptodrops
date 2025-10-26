/**
 * Authentication Controller
 * Handles user authentication operations (login and registration)
 * 
 * @module controllers/auth.controller
 */

import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

const authService = new AuthService();

/**
 * Authenticate user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @param {string} req.body.username - User's username
 * @param {string} req.body.password - User's password
 * @returns {Promise<Object>} Object containing JWT token and user info
 * @throws {UnauthorizedError} If credentials are invalid
 */
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.login(username, password);
  res.json(result);
});

/**
 * Register a new admin user
 * @route POST /api/auth/register
 * @access Public
 * @param {string} req.body.username - Desired username
 * @param {string} req.body.password - User's password
 * @returns {Promise<Object>} Object containing JWT token and user info
 * @throws {ValidationError} If username already exists or validation fails
 */
export const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.register(username, password);
  res.status(HTTP_STATUS.CREATED).json(result);
});
