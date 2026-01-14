#!/bin/bash

set -e
set -x

# Developer information
echo "- Running post-create.sh---------------------------->"
apt update && apt install iputils-ping -y;
npm install -g @angular/cli;
npm install leaflet@^1.9.4 --save;
npm install @types/leaflet --save;
npm install @angular/material --save;
npm install @angular/cdk --save;    
echo "<- Finished post-create.sh---------------------------"