#!/bin/bash
cd server/Greenhouse_App_Part3-serverside-main
npm install
cd ../../client/Greenhouse_App_Part3-clientside-main/greenhouse-app-part2
npm install
npm run build -- --output-path=../../../server/Greenhouse_App_Part3-serverside-main/dist/client
cd ../../../server/Greenhouse_App_Part3-serverside-main
node dist/app.js
