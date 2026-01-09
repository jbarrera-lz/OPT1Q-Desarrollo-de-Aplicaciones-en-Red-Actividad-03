#!/bin/bash

set -e
set -x

# Developer information
echo "- Running post-create.sh---------------------------->"
apt update && apt install iputils-ping -y;
npm install -g @angular/cli;
npm install ngx-markdown --save
npm install emoji-toolkit@^9.0.0 --save;
npm install mermaid@^11.0.0 --save;
npm install katex@^0.16.0 --save
npm install prismjs@^1.30.0 --save;
npm install leaflet@^1.9.4 --save;
npm install @types/leaflet --save;
npm install @angular/material --save;
npm install @angular/cdk --save;    
echo "<- Finished post-create.sh---------------------------"