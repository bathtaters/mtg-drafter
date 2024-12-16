# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.12.0
FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache openssl

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
COPY .env.prod .env
RUN npm run build

################################################################################
# Run
FROM base AS runner
WORKDIR /app
ARG LISTEN_PORT=3040
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