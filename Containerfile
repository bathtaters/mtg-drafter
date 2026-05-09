# syntax=docker/dockerfile:1
#
# build-arg: NODE_VERSION, LISTEN_PORT
#
# This image carries NO secrets. `prisma generate` and `next build` do
# not connect to the database, so DATABASE_URL is not needed at build
# time. Runtime secrets are injected via `podman run --env-file ...`.

ARG NODE_VERSION=22.12.0
FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache openssl
RUN npm install -g npm@latest

################################################################################
# Install dependecies
FROM base AS deps
# RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* .
RUN npm ci

################################################################################
# Build
FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npx next build

################################################################################
# Run
FROM base AS runner
WORKDIR /app
ARG LISTEN_PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE ${LISTEN_PORT}
ENV PORT=${LISTEN_PORT}
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]