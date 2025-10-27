import https from 'https';

const PING_URL = process.env.PING_URL || 'https://cryptodrops.onrender.com';
const PING_INTERVAL = parseInt(process.env.PING_INTERVAL) || 14 * 60 * 1000; // 14 minutes by default

function ping() {
  const url = new URL(PING_URL);
  
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'HEAD', // Use HEAD to avoid large response bodies
    timeout: 30000 // 30 second timeout
  };

  const req = https.request(options, (res) => {
    console.log(`[${new Date().toISOString()}] Ping successful - Status: ${res.statusCode}`);
  });

  req.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] Ping failed:`, error.message);
  });

  req.on('timeout', () => {
    req.destroy();
    console.error(`[${new Date().toISOString()}] Ping timeout`);
  });

  req.end();
}

// Ping immediately on startup
console.log(`Starting ping service for ${PING_URL}`);
console.log(`Ping interval: ${PING_INTERVAL / 1000 / 60} minutes`);
ping();

// Then ping at regular intervals
setInterval(ping, PING_INTERVAL);

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});
