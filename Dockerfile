FROM node:16

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

cmd ["node", "./prod/index.js"]