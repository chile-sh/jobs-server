FROM mhart/alpine-node:12

WORKDIR /opt/app

RUN yarn
RUN yarn global add nodemon

EXPOSE 9000

CMD [ "nodemon", "--", "--experimental-modules", "src/index.js" ]