#!/bin/bash
set -e

cd server
npm install

cd ../client
npm install
npx ng build --output-path=../server/dist/client

cd ../server
node dist/app.js
