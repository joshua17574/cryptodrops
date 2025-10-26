import NodeCache from 'node-cache';

/**
 * CacheService - Provides in-memory caching functionality
 * Uses node-cache for high-performance data caching
 * 
 * Default settings:
 * - stdTTL: 300 seconds (5 minutes) - Time to live for cached data
 * - checkperiod: 60 seconds - Automatic check for expired keys
 */
export class CacheService {
  constructor(ttlSeconds = 300) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2, // Check for expired keys every 20% of TTL
      useClones: false // Better performance, return reference instead of clone
    });
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined if not found/expired
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Set a value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Optional TTL in seconds (overrides default)
   * @returns {boolean} Success status
   */
  set(key, value, ttl) {
    return this.cache.set(key, value, ttl);
  }

  /**
   * Delete a specific key from cache
   * @param {string} key - Cache key to delete
   * @returns {number} Number of deleted entries
   */
  del(key) {
    return this.cache.del(key);
  }

  /**
   * Delete multiple keys from cache
   * @param {Array<string>} keys - Array of cache keys to delete
   * @returns {number} Number of deleted entries
   */
  delMultiple(keys) {
    return this.cache.del(keys);
  }

  /**
   * Flush all cache entries
   */
  flush() {
    this.cache.flushAll();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics (hits, misses, keys, etc.)
   */
  getStats() {
    return this.cache.getStats();
  }

  /**
   * Check if a key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Get all cache keys
   * @returns {Array<string>} Array of all cache keys
   */
  keys() {
    return this.cache.keys();
  }
}

// Export singleton instance for consistent caching across the app
export const cacheService = new CacheService(300); // 5 minutes default TTL
