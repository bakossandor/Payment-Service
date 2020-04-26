FROM node:13-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 5500
CMD [ "node", "index.js" ]