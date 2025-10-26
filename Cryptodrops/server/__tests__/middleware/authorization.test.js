/**
 * Authorization Middleware Tests
 * Tests for role-based access control (RBAC)
 */

import { authorizeRoles, requireAdmin } from '../../middleware/authorization.middleware.js';
import { ForbiddenError } from '../../utils/errors.js';

describe('Authorization Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: null
    };
    res = {};
    next = jest.fn();
  });

  describe('authorizeRoles', () => {
    it('should allow access when user has required role', () => {
      req.user = { id: 1, username: 'admin', role: 'admin' };
      const middleware = authorizeRoles('admin');
      
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should allow access when user has one of multiple allowed roles', () => {
      req.user = { id: 1, username: 'admin', role: 'admin' };
      const middleware = authorizeRoles('admin', 'superadmin');
      
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalledWith();
    });

    it('should deny access when user lacks required role', () => {
      req.user = { id: 2, username: 'user', role: 'user' };
      const middleware = authorizeRoles('admin');
      
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('should deny access when user is not authenticated', () => {
      req.user = null;
      const middleware = authorizeRoles('admin');
      
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('should deny access when user object exists but has no role', () => {
      req.user = { id: 3, username: 'norole' };
      const middleware = authorizeRoles('admin');
      
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });

  describe('requireAdmin', () => {
    it('should allow access for admin users', () => {
      req.user = { id: 1, username: 'admin', role: 'admin' };
      
      requireAdmin(req, res, next);
      
      expect(next).toHaveBeenCalledWith();
    });

    it('should deny access for non-admin users', () => {
      req.user = { id: 2, username: 'user', role: 'user' };
      
      requireAdmin(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });
});
