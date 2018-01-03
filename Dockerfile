FROM node:8.9.1

MAINTAINER <Adam Peryman> adam.peryman@gmail.com

RUN mkdir -p /var/www/api.adamperyman.com

WORKDIR /var/www/api.adamperyman.com

COPY node_modules node_modules
COPY package.json package.json
COPY lib lib
COPY index.js index.js
COPY yarn.lock yarn.lock
COPY .babelrc .babelrc

RUN cd /var/www/api.adamperyman.com && npm rebuild --build-from-source

EXPOSE 4000

CMD [ "yarn", "run:prod" ]
