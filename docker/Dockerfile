FROM mhart/alpine-node:12

WORKDIR /opt/app

COPY src src/
COPY package.json .
COPY yarn.lock .

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
RUN yarn install --production

EXPOSE 3000

CMD [ "node", "--experimental-modules", "src/index.js" ]