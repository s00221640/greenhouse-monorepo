#!/bin/bash
cd server
npm install

cd ../client
npm install --legacy-peer-deps
npx ng build --output-path=../server/dist/client

cd ../server
node dist/app.js
