#!/bin/bash
set -e

# Install backend
cd server/Greenhouse_App_Part3-serverside-main
npm install

# Install frontend
cd ../../client/Greenhouse_App_Part3-clientside-main/greenhouse-app-part2
npm install

# Build Angular
npx ng build --output-path=../../../../server/Greenhouse_App_Part3-serverside-main/dist/client

# Start backend
cd ../../../../server/Greenhouse_App_Part3-serverside-main
npm run build
node dist/app.js
