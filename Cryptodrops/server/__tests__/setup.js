/**
 * Jest Test Setup
 * Configures the testing environment and provides test utilities
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';

// Extend Jest timeout for database operations
jest.setTimeout(10000);

// Global test utilities
global.testUtils = {
  /**
   * Generate a mock JWT token for testing
   */
  generateMockToken: () => {
    return 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInJvbGUiOiJhZG1pbiJ9.test';
  },
  
  /**
   * Create mock airdrop data for testing
   */
  createMockAirdrop: (overrides = {}) => ({
    name: 'Test Airdrop',
    description: 'Test airdrop description',
    blockchain: 'Ethereum',
    type: 'Token',
    status: 'active',
    verified: false,
    participants: 100,
    ...overrides
  })
};

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
