/**
 * Authorization Middleware
 * Handles role-based access control (RBAC)
 * Ensures users have the required roles to access protected routes
 * 
 * @module middleware/authorization.middleware
 */

import { ForbiddenError } from '../utils/errors.js';
import { ERROR_MESSAGES } from '../constants/http.constants.js';

/**
 * Middleware to check if user has required role(s)
 * Must be used after authenticateToken middleware
 * 
 * @param {...string} allowedRoles - One or more roles that are allowed to access the route
 * @returns {Function} Express middleware function
 * @throws {ForbiddenError} If user doesn't have required role
 * 
 * @example
 * router.post('/admin', authenticateToken, authorizeRoles('admin'), adminController);
 * router.post('/superadmin', authenticateToken, authorizeRoles('admin', 'superadmin'), controller);
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by authenticateToken)
    if (!req.user) {
      return next(new ForbiddenError(ERROR_MESSAGES.ACCESS_DENIED));
    }

    // Check if user has one of the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS));
    }

    next();
  };
};

/**
 * Convenience middleware to require admin role
 * Equivalent to authorizeRoles('admin')
 */
export const requireAdmin = authorizeRoles('admin');
