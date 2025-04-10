#!/bin/bash
set -e

echo "Installing server dependencies..."
cd server/Greenhouse_App_Part3-serverside-main
npm install --omit=dev

echo "Building TypeScript server..."
npm run build

echo "Starting server..."
node dist/src/app.js
