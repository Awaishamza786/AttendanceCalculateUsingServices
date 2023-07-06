FROM node:18.16.0-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
