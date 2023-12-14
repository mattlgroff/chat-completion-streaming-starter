# syntax=docker/dockerfile:1
# Stage 1 - the build process
FROM --platform=linux/amd64 oven/bun:1.0.3 AS builder

WORKDIR /app

COPY package.json bun.lockb ./

# The VITE_ variables need to be available at build time.
ARG VITE_API_HOSTNAME
ENV VITE_API_HOSTNAME=$VITE_API_HOSTNAME

RUN bun install

COPY . .

RUN bun run build

# Stage 2 - the production environment
FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]