import { cacheService } from '../services/cache.service.js';

/**
 * Cache middleware factory
 * Creates a middleware that caches responses based on request URL
 * 
 * @param {number} duration - Cache duration in seconds (default: 300)
 * @returns {Function} Express middleware function
 * 
 * @example
 * app.get('/api/stats', cacheMiddleware(600), statsController);
 */
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from request URL and query parameters
    const key = `cache:${req.originalUrl || req.url}`;
    
    // Try to get cached response
    const cachedResponse = cacheService.get(key);
    
    if (cachedResponse) {
      // Return cached response with cache hit header
      res.set('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to cache the response
    res.json = (body) => {
      // Cache the response body
      cacheService.set(key, body, duration);
      
      // Add cache miss header
      res.set('X-Cache', 'MISS');
      
      // Send the response
      return originalJson(body);
    };

    next();
  };
};

/**
 * Middleware to invalidate specific cache keys
 * Used after data modifications (POST, PUT, DELETE)
 * Invalidates cache AFTER response is fully sent
 * 
 * @param {string|Array<string>} patterns - Cache key patterns to invalidate
 * @returns {Function} Express middleware function
 * 
 * @example
 * app.post('/api/airdrops', invalidateCache('cache:/api/stats'), createAirdrop);
 */
export const invalidateCache = (patterns) => {
  return (req, res, next) => {
    // Listen for response finish event to invalidate cache
    res.on('finish', () => {
      // Only invalidate on successful responses (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const patternsArray = Array.isArray(patterns) ? patterns : [patterns];
        
        // Get all cache keys
        const allKeys = cacheService.keys();
        
        // Find keys matching patterns (use startsWith for prefix matching)
        const keysToDelete = allKeys.filter(key => 
          patternsArray.some(pattern => key.startsWith(pattern))
        );
        
        // Delete matching keys
        if (keysToDelete.length > 0) {
          cacheService.delMultiple(keysToDelete);
        }
      }
    });
    
    next();
  };
};

/**
 * Middleware to clear all cache
 * Use with caution - clears entire cache
 */
export const clearAllCache = (req, res, next) => {
  cacheService.flush();
  next();
};
