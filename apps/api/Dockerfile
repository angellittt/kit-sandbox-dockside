ARG NODE_VERSION=24.14.0
FROM node:${NODE_VERSION}-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prepare

WORKDIR /app

RUN pnpm add turbo --global
COPY . .
RUN turbo prune api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS builder

WORKDIR /app
# First install dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN pnpm install
# Build the project and its dependencies
COPY --from=prepare /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build

# Development target
FROM node:${NODE_VERSION}-alpine AS development

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml turbo.json ./

COPY apps ./apps

RUN pnpm install

COPY . .

CMD ["pnpm", "--filter", "api", "dev"]

# Production target
FROM node:${NODE_VERSION}-alpine AS production
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=builder /app .

CMD ["node", "apps/api/dist/index.js"]