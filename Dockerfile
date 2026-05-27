FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY playground/package.json playground/package-lock.json* ./playground/
WORKDIR /app/playground
RUN npm install --omit=dev

COPY playground/ ./

RUN mkdir -p data && \
    node -e "const fs=require('fs');const Database=require('better-sqlite3');const db=new Database('data/lab.db');const schema=fs.readFileSync('db/schema.sql','utf8');const seed=fs.readFileSync('db/seed.sql','utf8');db.exec(schema);db.exec(seed);db.close();"

WORKDIR /app/playground
ENV NODE_ENV=development
ENV DATABASE_PATH=/app/playground/data/lab.db

EXPOSE 3000

CMD ["node", "src/server.js"]
