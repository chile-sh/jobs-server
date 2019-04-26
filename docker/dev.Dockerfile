FROM mhart/alpine-node:12

WORKDIR /opt/app

RUN yarn
RUN yarn global add nodemon

EXPOSE 3000

CMD [ "nodemon", "--", "--inspect=0.0.0.0", "--inspect-brk=0.0.0.0", "--experimental-modules", "src/index.js" ]