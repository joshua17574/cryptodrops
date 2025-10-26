/**
 * Custom Validators
 * Additional validation utilities to supplement express-validator
 * Provides enhanced security checks for inputs
 * 
 * @module utils/validators
 */

/**
 * Enhanced URL validation to mitigate validator.js bypass vulnerability
 * GHSA-9965-vmph-33xx: validator.js has URL validation bypass
 * 
 * This function provides stricter URL validation than validator.isURL
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid and safe
 */
export const isSecureURL = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    // Use native URL constructor for parsing (more secure)
    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Ensure hostname is not empty and doesn't contain suspicious patterns
    if (!parsedUrl.hostname || parsedUrl.hostname.length === 0) {
      return false;
    }
    
    // Block common bypass attempts
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Block localhost and local IPs (SSRF protection)
    // Covers all RFC1918 private networks, link-local, and IPv6 equivalents
    
    // IPv4 loopback and special addresses
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('127.') ||      // Full loopback range 127.0.0.0/8
      hostname.startsWith('192.168.') ||  // Private network 192.168.0.0/16
      hostname.startsWith('10.') ||       // Private network 10.0.0.0/8
      hostname.startsWith('169.254.')     // Link-local 169.254.0.0/16
    ) {
      return false;
    }
    
    // Check for 172.16.0.0/12 range (172.16.0.0 - 172.31.255.255)
    if (hostname.startsWith('172.')) {
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        const secondOctet = parseInt(parts[1], 10);
        if (secondOctet >= 16 && secondOctet <= 31) {
          return false;
        }
      }
    }
    
    // IPv6 loopback and local addresses
    if (
      hostname === '::1' ||                                    // IPv6 loopback (without brackets)
      hostname === '0:0:0:0:0:0:0:1' ||                       // IPv6 loopback (full form)
      /^fe[89ab][0-9a-f]:/i.test(hostname) ||                // IPv6 link-local fe80::/10 (fe80-febf)
      /^f[cd][0-9a-f]{2}:/i.test(hostname)                   // IPv6 ULA fc00::/7 (fc00-fdff)
    ) {
      return false;
    }
    
    // IPv4-mapped IPv6 addresses (::ffff:x.x.x.x)
    if (hostname.toLowerCase().includes('::ffff:')) {
      const ipv4Part = hostname.split('::ffff:')[1];
      if (ipv4Part) {
        // Recursively check the IPv4 part
        try {
          const testUrl = new URL(`http://${ipv4Part}`);
          return isSecureURL(`http://${ipv4Part}`);
        } catch {
          return false;
        }
      }
    }
    
    // Block URLs with credentials (potential phishing)
    if (parsedUrl.username || parsedUrl.password) {
      return false;
    }
    
    // Additional checks for common bypass techniques
    if (
      hostname.includes('..') ||  // Path traversal attempts
      hostname.includes('%') ||   // Encoded characters in hostname
      hostname.includes('@')      // Username in hostname
    ) {
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid URL
    return false;
  }
};

/**
 * Sanitize text input to prevent XSS
 * Additional layer on top of express-validator's escape()
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate and sanitize social media links
 * @param {string} link - Social media link
 * @param {string} platform - Platform name (twitter, discord, telegram)
 * @returns {boolean} True if link is valid for the platform
 */
export const isSocialMediaLink = (link, platform) => {
  if (!link || typeof link !== 'string') {
    return true; // Allow empty (optional field)
  }
  
  // First check if it's a valid URL
  if (!isSecureURL(link)) {
    return false;
  }
  
  try {
    const url = new URL(link);
    const hostname = url.hostname.toLowerCase();
    
    switch (platform) {
      case 'twitter':
        return hostname === 'twitter.com' || hostname === 'x.com' || hostname.endsWith('.twitter.com') || hostname.endsWith('.x.com');
      case 'discord':
        return hostname === 'discord.gg' || hostname === 'discord.com' || hostname.endsWith('.discord.com');
      case 'telegram':
        return hostname === 't.me' || hostname === 'telegram.me' || hostname.endsWith('.telegram.org');
      default:
        return true;
    }
  } catch {
    return false;
  }
};
