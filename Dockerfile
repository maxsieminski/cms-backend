FROM node:latest

WORKDIR /usr/src/

COPY package*.json ./

RUN npm install
RUN npm run build

RUN ls

COPY . .

CMD ["node", "dist/server.js"]
