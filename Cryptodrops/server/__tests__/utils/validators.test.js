/**
 * Custom Validators Tests
 * Tests for enhanced security validators
 */

import { isSecureURL, sanitizeText, isSocialMediaLink } from '../../utils/validators.js';

describe('Custom Validators', () => {
  describe('isSecureURL', () => {
    it('should accept valid HTTPS URLs', () => {
      expect(isSecureURL('https://example.com')).toBe(true);
      expect(isSecureURL('https://subdomain.example.com/path?query=value')).toBe(true);
    });

    it('should accept valid HTTP URLs', () => {
      expect(isSecureURL('http://example.com')).toBe(true);
    });

    it('should reject non-HTTP(S) protocols', () => {
      expect(isSecureURL('ftp://example.com')).toBe(false);
      expect(isSecureURL('javascript:alert(1)')).toBe(false);
      expect(isSecureURL('data:text/html,<script>alert(1)</script>')).toBe(false);
    });

    it('should reject localhost and local IPs (SSRF protection)', () => {
      // Loopback
      expect(isSecureURL('http://localhost')).toBe(false);
      expect(isSecureURL('http://127.0.0.1')).toBe(false);
      expect(isSecureURL('http://127.255.255.255')).toBe(false);
      expect(isSecureURL('http://0.0.0.0')).toBe(false);
      
      // Private networks (RFC1918)
      expect(isSecureURL('http://192.168.1.1')).toBe(false);
      expect(isSecureURL('http://10.0.0.1')).toBe(false);
      expect(isSecureURL('http://10.255.255.255')).toBe(false);
      
      // Full 172.16.0.0/12 range
      expect(isSecureURL('http://172.16.0.1')).toBe(false);
      expect(isSecureURL('http://172.31.255.255')).toBe(false);
      expect(isSecureURL('http://172.20.1.1')).toBe(false);
      
      // Should allow 172.15 and 172.32 (outside private range)
      expect(isSecureURL('http://172.15.0.1')).toBe(true);
      expect(isSecureURL('http://172.32.0.1')).toBe(true);
      
      // Link-local
      expect(isSecureURL('http://169.254.1.1')).toBe(false);
      
      // IPv6 local addresses
      expect(isSecureURL('http://[::1]')).toBe(false);
      expect(isSecureURL('http://[fc00::1]')).toBe(false);
      expect(isSecureURL('http://[fd00::1]')).toBe(false);
      
      // IPv6 link-local fe80::/10 (fe80-febf)
      expect(isSecureURL('http://[fe80::1]')).toBe(false);
      expect(isSecureURL('http://[fe90::1]')).toBe(false);
      expect(isSecureURL('http://[fea0::1]')).toBe(false);
      expect(isSecureURL('http://[febf::1]')).toBe(false);
      
      // IPv4-mapped IPv6 addresses
      expect(isSecureURL('http://[::ffff:127.0.0.1]')).toBe(false);
      expect(isSecureURL('http://[::ffff:10.0.0.1]')).toBe(false);
      expect(isSecureURL('http://[::ffff:192.168.1.1]')).toBe(false);
    });

    it('should reject URLs with credentials', () => {
      expect(isSecureURL('http://user:pass@example.com')).toBe(false);
      expect(isSecureURL('https://admin@example.com')).toBe(false);
    });

    it('should reject URLs with suspicious patterns', () => {
      expect(isSecureURL('http://example..com')).toBe(false);
      expect(isSecureURL('http://example.com@evil.com')).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(isSecureURL('not a url')).toBe(false);
      expect(isSecureURL('')).toBe(false);
      expect(isSecureURL(null)).toBe(false);
      expect(isSecureURL(undefined)).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    it('should remove angle brackets', () => {
      expect(sanitizeText('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
    });

    it('should remove javascript: protocol', () => {
      expect(sanitizeText('javascript:alert(1)')).toBe('alert(1)');
    });

    it('should remove event handlers', () => {
      expect(sanitizeText('onclick=alert(1)')).toBe('alert(1)');
      expect(sanitizeText('onload=alert(1)')).toBe('alert(1)');
    });

    it('should handle empty and invalid inputs', () => {
      expect(sanitizeText('')).toBe('');
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
    });

    it('should trim whitespace', () => {
      expect(sanitizeText('  hello  ')).toBe('hello');
    });
  });

  describe('isSocialMediaLink', () => {
    describe('Twitter links', () => {
      it('should accept valid Twitter URLs', () => {
        expect(isSocialMediaLink('https://twitter.com/username', 'twitter')).toBe(true);
        expect(isSocialMediaLink('https://x.com/username', 'twitter')).toBe(true);
      });

      it('should reject non-Twitter URLs', () => {
        expect(isSocialMediaLink('https://facebook.com/page', 'twitter')).toBe(false);
        expect(isSocialMediaLink('https://evil.com', 'twitter')).toBe(false);
      });
    });

    describe('Discord links', () => {
      it('should accept valid Discord URLs', () => {
        expect(isSocialMediaLink('https://discord.gg/invite', 'discord')).toBe(true);
        expect(isSocialMediaLink('https://discord.com/invite/code', 'discord')).toBe(true);
      });

      it('should reject non-Discord URLs', () => {
        expect(isSocialMediaLink('https://notdiscord.com', 'discord')).toBe(false);
      });
    });

    describe('Telegram links', () => {
      it('should accept valid Telegram URLs', () => {
        expect(isSocialMediaLink('https://t.me/channel', 'telegram')).toBe(true);
        expect(isSocialMediaLink('https://telegram.me/channel', 'telegram')).toBe(true);
      });

      it('should reject non-Telegram URLs', () => {
        expect(isSocialMediaLink('https://nottelegram.com', 'telegram')).toBe(false);
      });
    });

    it('should allow empty links (optional field)', () => {
      expect(isSocialMediaLink('', 'twitter')).toBe(true);
      expect(isSocialMediaLink(null, 'discord')).toBe(true);
    });
  });
});
