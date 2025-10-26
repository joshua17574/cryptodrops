/**
 * Logger Utility
 * Provides structured logging for the application
 * Supports different log levels and formats output for production
 * 
 * @module utils/logger
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  /**
   * Format log entry with timestamp and metadata
   * @private
   */
  _formatLog(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...metadata
    };

    if (this.isDevelopment) {
      return this._formatDevelopment(level, message, metadata);
    }

    return JSON.stringify(logEntry);
  }

  /**
   * Format log for development (human-readable)
   * @private
   */
  _formatDevelopment(level, message, metadata) {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
      ERROR: '❌',
      WARN: '⚠️',
      INFO: 'ℹ️',
      DEBUG: '🔍'
    }[level] || '';

    let formatted = `[${timestamp}] ${emoji} ${level}: ${message}`;
    
    if (Object.keys(metadata).length > 0) {
      formatted += '\n' + JSON.stringify(metadata, null, 2);
    }

    return formatted;
  }

  /**
   * Log error messages
   * @param {string} message - Error message
   * @param {Object} metadata - Additional context
   */
  error(message, metadata = {}) {
    const log = this._formatLog(LOG_LEVELS.ERROR, message, metadata);
    console.error(log);
  }

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {Object} metadata - Additional context
   */
  warn(message, metadata = {}) {
    const log = this._formatLog(LOG_LEVELS.WARN, message, metadata);
    console.warn(log);
  }

  /**
   * Log informational messages
   * @param {string} message - Info message
   * @param {Object} metadata - Additional context
   */
  info(message, metadata = {}) {
    const log = this._formatLog(LOG_LEVELS.INFO, message, metadata);
    console.log(log);
  }

  /**
   * Log debug messages (only in development)
   * @param {string} message - Debug message
   * @param {Object} metadata - Additional context
   */
  debug(message, metadata = {}) {
    if (this.isDevelopment) {
      const log = this._formatLog(LOG_LEVELS.DEBUG, message, metadata);
      console.log(log);
    }
  }

  /**
   * Log HTTP request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  logRequest(req, res) {
    const metadata = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      userAgent: req.get('user-agent'),
      ip: req.ip
    };

    if (res.statusCode >= 400) {
      this.warn(`HTTP ${res.statusCode} - ${req.method} ${req.url}`, metadata);
    } else {
      this.info(`HTTP ${res.statusCode} - ${req.method} ${req.url}`, metadata);
    }
  }

  /**
   * Log application error with stack trace
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  logError(error, context = {}) {
    const metadata = {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      ...context
    };

    this.error(error.message, metadata);
  }
}

export const logger = new Logger();
