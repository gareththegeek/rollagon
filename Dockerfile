FROM node:16-alpine as builder
WORKDIR /app

WORKDIR /app/client
COPY ./client/package*.json ./
RUN npm install --omit=dev
COPY ./client ./
RUN npm run build

WORKDIR /app/server
COPY ./server/package*.json ./
RUN npm install
COPY ./server ./
RUN npm run build

FROM node:16-alpine

ENV COSMOS_CONNECTION_STRING ""
ENV COSMOS_DATABASE_NAME "rollagon"
ENV GAME_COLLECTION_NAME "games"
ENV APPINSIGHTS_INSTRUMENTATIONKEY ""
ENV NODE_ENV production

WORKDIR /app
COPY --from=builder /app/server/dist /app
COPY ./server/package*.json /app
RUN npm install --omit=dev

EXPOSE 8080
USER node
CMD ["node", "index.js"]