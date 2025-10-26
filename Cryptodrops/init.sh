#!/bin/bash
# Change to the Cryptodrops directory
cd "$(dirname "$0")" || exit

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start the server
npm start
