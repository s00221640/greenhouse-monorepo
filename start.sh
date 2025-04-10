#!/bin/bash
set -e

echo "Installing server dependencies..."
cd server/Greenhouse_App_Part3-serverside-main
npm install

echo "Installing client dependencies..."
cd ../../client/Greenhouse_App_Part3-clientside-main/greenhouse-app-part2
npm install

echo "Building Angular app..."
npx ng build --output-path=../../../server/Greenhouse_App_Part3-serverside-main/dist/client

echo "Building TypeScript server..."
cd ../../../server/Greenhouse_App_Part3-serverside-main
npm run build

echo "Starting server..."
node dist/app.js