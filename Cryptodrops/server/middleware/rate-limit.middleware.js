export const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    maxRequests = 5,
    message = 'Too many requests, please try again later'
  } = options;

  const requests = new Map();

  const cleanup = () => {
    const now = Date.now();
    for (const [key, data] of requests.entries()) {
      if (now - data.resetTime > windowMs) {
        requests.delete(key);
      }
    }
  };

  const cleanupInterval = setInterval(cleanup, Math.min(windowMs, 60000));

  const middleware = (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const requestData = requests.get(identifier);

    if (!requestData || now - requestData.resetTime > windowMs) {
      requests.set(identifier, {
        count: 1,
        resetTime: now
      });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    if (requestData.count >= maxRequests) {
      const retryAfter = Math.ceil((requestData.resetTime + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      return res.status(429).json({ error: message });
    }

    requestData.count++;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - requestData.count);
    next();
  };

  middleware.cleanup = () => {
    clearInterval(cleanupInterval);
    requests.clear();
  };

  return middleware;
};
