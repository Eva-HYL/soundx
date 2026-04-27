# syntax=docker/dockerfile:1.7
#
# SoundX API —— 多阶段构建。
# pnpm workspace 下：
#   1. base    装 pnpm
#   2. deps    拷 workspace 元数据，解析依赖
#   3. build   拷源码 + prisma generate + tsc build
#   4. runner  拷 dist + 生产依赖，最小镜像启动
#
# 构建（在仓库根执行，不是 apps/api/）：
#   docker build -f apps/api/Dockerfile -t soundx-api:latest .
#
# 运行：
#   docker run --rm -p 3000:3000 --env-file deploy/.env soundx-api:latest

# ---------- Stage 1: base ----------
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# ---------- Stage 2: deps ----------
FROM base AS deps
# 拷 workspace 元数据用于缓存 pnpm-store
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY apps/shared-types/package.json apps/shared-types/
COPY apps/admin/package.json apps/admin/
COPY apps/miniapp/package.json apps/miniapp/
# schema 要在 deps 阶段就存在，因为 @prisma/client postinstall 会跑 prisma generate
COPY prisma/ prisma/

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- Stage 3: build ----------
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/apps/shared-types/node_modules ./apps/shared-types/node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY prisma/ prisma/
COPY apps/shared-types/ apps/shared-types/
COPY apps/api/ apps/api/

# shared-types 先 build（api 依赖它）
RUN pnpm --filter @soundx/shared-types build

# Prisma Client 在 deps 阶段已经生成过；构建时 tsc 需要它已经在 node_modules
RUN DATABASE_URL="mysql://placeholder:placeholder@placeholder:3306/placeholder" \
    pnpm --filter @soundx/api exec prisma generate --schema=../../prisma/schema.prisma

# 编译 API
RUN pnpm --filter @soundx/api build

# ---------- Stage 4: runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# 运行时也需要 pnpm 以便跑 prisma migrate deploy（corepack 开销极小）
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# 创建非 root 用户
RUN addgroup -S soundx && adduser -S soundx -G soundx

# 只拷运行所需
COPY --from=build --chown=soundx:soundx /app/apps/api/dist ./apps/api/dist
COPY --from=build --chown=soundx:soundx /app/apps/api/package.json ./apps/api/
COPY --from=build --chown=soundx:soundx /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=soundx:soundx /app/apps/shared-types/dist ./apps/shared-types/dist
COPY --from=build --chown=soundx:soundx /app/apps/shared-types/package.json ./apps/shared-types/
COPY --from=build --chown=soundx:soundx /app/node_modules ./node_modules
COPY --from=build --chown=soundx:soundx /app/package.json ./
COPY --from=build --chown=soundx:soundx /app/pnpm-workspace.yaml ./
COPY --from=build --chown=soundx:soundx /app/prisma ./prisma

USER soundx
EXPOSE 3000
# 启动：先跑 migrate deploy（幂等，没新 migration 时秒退），再启主进程
CMD ["sh", "-c", "pnpm exec prisma migrate deploy --schema=./prisma/schema.prisma && node apps/api/dist/main.js"]
