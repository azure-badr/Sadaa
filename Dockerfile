FROM node:16

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Run deploy-commands.js to register slash commands
RUN node ./prod/deploy-commands.js

CMD ["node", "./prod/index.js"]