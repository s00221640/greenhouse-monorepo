#!/bin/bash
set -e

# Install only server dependencies (we don't need to build Angular in production)
echo "Installing server dependencies..."
cd server/Greenhouse_App_Part3-serverside-main
npm install --omit=dev

# Build TypeScript server
echo "Building server..."
npm run build

# Start the server directly
echo "Starting server..."
node dist/app.js