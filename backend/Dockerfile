# syntax=docker/dockerfile:1
FROM oven/bun:1.0.17

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "index.ts"]