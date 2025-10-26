/**
 * Jest Configuration
 * Configures Jest testing framework for the CryptoDrops application
 */

export default {
  // Use Node environment for testing
  testEnvironment: 'node',
  
  // Support ES6 modules
  transform: {},
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Coverage settings
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/index.js',
    '!server/db.js',
    '!server/**/*.test.js',
    '!server/**/__tests__/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/server/__tests__/setup.js'],
  
  // Module file extensions
  moduleFileExtensions: ['js', 'json'],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/public/'
  ],
  
  // Verbose output
  verbose: true
};
