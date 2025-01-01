FROM node:22.6.0

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY . .

RUN npm run build

ENV PORT=3000

EXPOSE 3000

CMD [ "npm","run" ,"dev"]