import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/http.constants.js';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const context = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  };

  if (err instanceof AppError) {
    logger.warn(`Application Error: ${err.message}`, {
      statusCode: err.statusCode,
      ...context
    });

    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  logger.logError(err, context);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: ERROR_MESSAGES.SERVER_ERROR,
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
};
