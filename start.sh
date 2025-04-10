#!/bin/bash
cd server
npm install

cd ../client/Greenhouse_App_Part3-clientside-main/greenhouse-app-part2
npm install --legacy-peer-deps
npx ng build --output-path=../../../server/Greenhouse_App_Part3-serverside-main/dist/client

cd ../../../server/Greenhouse_App_Part3-serverside-main
node dist/app.js
