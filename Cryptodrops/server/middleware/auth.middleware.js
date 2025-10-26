import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { ERROR_MESSAGES } from '../constants/http.constants.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError(ERROR_MESSAGES.ACCESS_DENIED));
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return next(new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN));
    }
    req.user = user;
    next();
  });
};
