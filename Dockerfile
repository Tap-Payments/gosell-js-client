FROM node:alpine

WORKDIR /app

COPY .npmrc /app
COPY package.json /app
RUN npm install
RUN rm -f .npmrc

RUN npm install -g pm2@latest

# Add your source files
COPY . /app
RUN npm run build
# RUN ls
CMD npm run deploy
