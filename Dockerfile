FROM node:16 as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci && npm install typescript@3.8.3 -g
COPY . .
RUN tsc && node tsconfig-paths-bootstrap.js

FROM node:16
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=builder /usr/src/app/build /usr/src/app
CMD ["node", "./app.js"]

