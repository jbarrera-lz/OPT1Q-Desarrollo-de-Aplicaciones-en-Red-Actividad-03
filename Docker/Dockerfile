ARG _base_image_=docker.io/node:25.2.1
ARG _prod_image_=docker.io/nginx:stable-alpine3.21-slim
ARG _base_url_prod_=https://unir.development.es/

FROM ${_base_image_} AS development
ARG _base_image_
ARG _prod_image_
ARG _base_url_prod_

WORKDIR /workspace
COPY .  .

RUN <<EOF
apt update && apt install iputils-ping -y;
npm install -g @angular/cli;
npm install ngx-markdown --save;
npm install emoji-toolkit@^9.0.0 --save;
npm install mermaid@^11.0.0 --save;
npm install katex@^0.16.0 --save
npm install prismjs@^1.30.0 --save;
ng build --output-path docs --base-href ${_base_url_prod_}
EOF

FROM ${_prod_image_} AS production
ARG _base_image_
ARG _prod_image_
ARG _base_url_prod_

WORKDIR /usr/share/nginx/html/
COPY --from=development /workspace/docs/browser/ .

WORKDIR /etc/nginx/
COPY nginx/unir.development.key .
COPY nginx/unir.development.crt .
COPY nginx/nginx.conf ./nginx.conf

WORKDIR /etc/nginx/sites-enabled/
COPY nginx/unir.prod.conf .

WORKDIR /
