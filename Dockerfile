FROM node:19-alpine3.15 as prod-deps
WORKDIR /app
COPY package.json package.json
RUN npm install 

FROM node:19-alpine3.15 as builder
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:19-alpine3.15 as prod
EXPOSE 3000
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views
COPY --from=builder /app/public ./public
RUN mkdir uploads
CMD [ "node","dist/main.js"]