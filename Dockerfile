FROM node:16

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Run deploy-commands.js to register slash commands
RUN npm run deploy

CMD ["node", "./prod/index.js"]