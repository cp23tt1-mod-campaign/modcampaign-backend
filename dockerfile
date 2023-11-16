FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080

# CMD ["sh", "-c", "npm run compile && npm run start"]
CMD ["sh", "-c", "npm run dev"]