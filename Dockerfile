FROM keymetrics/pm2:latest-alpine

COPY src src/
COPY package.json .
COPY ecosystem.config.js .

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

EXPOSE 9000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
