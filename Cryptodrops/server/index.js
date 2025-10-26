import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.config.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { DatabaseService } from './services/database.service.js';
import { cacheMiddleware } from './middleware/cache.middleware.js';
import { AirdropService } from './services/airdrop.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const databaseService = new DatabaseService();

/**
 * Security Middleware
 * - Helmet: Sets secure HTTP headers (XSS protection, clickjacking protection, HSTS, etc.)
 * - CORS: Configured for environment-specific origins
 * 
 * Content Security Policy (CSP):
 * - Allows inline styles (for current HTML compatibility) but blocks inline scripts in production
 * - For maximum security, migrate inline styles to external CSS files and remove unsafe-inline
 * - To migrate: Move all inline scripts to external JS files and use nonces/hashes
 * 
 * Current approach balances security with backward compatibility:
 * - Inline scripts blocked in production (most dangerous attack vector)
 * - Inline styles allowed (lower risk, maintains UI compatibility)
 */
const isDevelopment = process.env.NODE_ENV === 'development';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Allow inline styles for HTML compatibility, but consider migration to external CSS
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      // Block inline scripts in production (main XSS vector), allow in dev for debugging
      scriptSrc: ["'self'", ...(isDevelopment ? ["'unsafe-inline'", "'unsafe-hashes'"] : [])],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true
}));

/**
 * CORS Configuration
 * Production: Set ALLOWED_ORIGINS in .env (comma-separated list)
 * Example: ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
 * Development: Defaults to '*' (allow all origins)
 * 
 * Security Note: Always set ALLOWED_ORIGINS in production to prevent unauthorized access
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : (process.env.NODE_ENV === 'production' ? [] : ['*']);

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  console.warn('⚠️  WARNING: ALLOWED_ORIGINS not set in production. API will reject all cross-origin requests.');
}

app.use(cors({
  origin: allowedOrigins[0] === '*' ? true : allowedOrigins,
  credentials: false, // Set to true only if using cookies for auth (we use JWT in Authorization header)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

/**
 * Performance Middleware
 * - Compression: Gzip compression for responses
 */
app.use(compression());

/**
 * Body Parser Middleware
 * - JSON parser with size limit for security
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Static File Serving
 */
app.use(express.static(path.join(__dirname, '../public')));

/**
 * API Routes
 */
app.use('/api', routes);

/**
 * Stats Endpoint - Cached for performance
 * Cache duration: 5 minutes (300 seconds)
 * Cache invalidated when airdrops are created/updated/deleted
 */
app.get('/api/stats', cacheMiddleware(300), async (req, res, next) => {
  try {
    const airdropService = new AirdropService();
    const stats = await airdropService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    next();
  }
});

app.use(errorHandler);

async function startServer() {
  try {
    console.log('\n🔧 Setting up database...');
    await databaseService.setupTables();
    await databaseService.initializeDefaultAdmin();

    app.listen(config.port, '0.0.0.0', () => {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Server running on port ${config.port}`);
      console.log('✨ Server ready!');
      console.log('📍 Open /admin.html to access the admin panel');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
