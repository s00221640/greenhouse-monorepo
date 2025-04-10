#!/bin/bash
set -e

echo "Installing server dependencies..."
cd server/Greenhouse_App_Part3-serverside-main
npm install --omit=dev

echo "Building Angular frontend..."
cd ../../client/Greenhouse_App_Part3-clientside-main/greenhouse-app-part2
npm install
npx ng build --output-path=../../../server/Greenhouse_App_Part3-serverside-main/dist/client/browser

echo "Building TypeScript backend..."
cd ../../../server/Greenhouse_App_Part3-serverside-main
npm run build

echo "Starting server..."
node dist/app.js
