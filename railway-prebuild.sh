#!/bin/bash
set -e

# Install client dependencies
echo "Installing client dependencies..."
cd client/Greenhouse_App_Part3-clientside-main/greenhouse-app-part2
npm install

# Build Angular with memory optimizations
echo "Building Angular with memory optimizations..."
NODE_OPTIONS="--max_old_space_size=512" npx ng build --configuration production --aot --build-optimizer --output-path=../../../server/Greenhouse_App_Part3-serverside-main/dist/client

echo "Angular build completed successfully!"