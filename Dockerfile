FROM node:10-alpine
WORKDIR /app
COPY package.json .
COPY server.js .
COPY /public ./public
RUN npm install

CMD ["node", "server.js"]
