FROM node:18-alpine as builder

RUN mkdir -p /app/server
WORKDIR /app/server

COPY package*.json /app/server/

# Copy the server files over
COPY . /app/server/

FROM node:18.0-alpine

# Create and set the working directory
RUN mkdir -p /app/server
WORKDIR /app/server

# Copy the server from the build container
COPY --from=builder /app/server /app/server

RUN npm install --only=production && npm cache clean --force && npm install -g typescript

CMD ["node", "./src/server.ts"]
