ARG NODE_VERSION=24.14.0
FROM node:${NODE_VERSION}-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set working directory
WORKDIR /app

# ---
FROM base AS prepare

WORKDIR /app
RUN pnpm add turbo --global 
COPY . .
RUN turbo prune web --docker

# ---
FROM base AS builder

WORKDIR /app
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN pnpm install --frozen-lockfile
# Build the project
COPY --from=prepare /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build

# Development target
FROM builder AS development

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --from=builder /app ./
CMD ["pnpm", "--filter", "web", "dev"]

# ---
FROM caddy:2-alpine AS production

COPY --from=prepare /app/apps/web/Caddyfile /etc/caddy/Caddyfile

COPY --from=builder /app/apps/web/dist /usr/share/caddy

EXPOSE 80
EXPOSE 443

