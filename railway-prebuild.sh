#!/bin/bash
set -e

# Install client dependencies
echo "Installing client dependencies..."
cd client/Greenhouse_App_Part3-clientside-main/greenhouse-app-part2
npm install

# Build Angular with memory optimizations
echo "Building Angular with memory optimizations..."
NODE_OPTIONS="--max_old_space_size=512" npx ng build --configuration production --output-path=../../../server/Greenhouse_App_Part3-serverside-main/dist/client

# Ensure the output directory exists
mkdir -p ../../../server/Greenhouse_App_Part3-serverside-main/dist/client

# List the files to verify the build worked
echo "Listing built Angular files:"
ls -la ../../../server/Greenhouse_App_Part3-serverside-main/dist/client

echo "Angular build completed successfully!"