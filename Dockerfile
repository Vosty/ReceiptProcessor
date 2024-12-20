FROM node:20

WORKDIR /usr/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD ["node" , "index.js"]