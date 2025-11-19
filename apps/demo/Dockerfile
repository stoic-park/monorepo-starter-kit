FROM node:18-alpine AS base

# 1. Prune Stage
# 필요한 패키지만 추출하여 이미지 크기를 줄입니다.
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune --scope=demo --docker

# 2. Install & Build Stage
# 추출된 패키지를 기반으로 의존성을 설치하고 빌드합니다.
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 의존성 설치 (Lockfile 활용)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install --frozen-lockfile

# 소스 코드 복사 및 빌드
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=demo...

# 3. Runner Stage
# Nginx를 사용하여 정적 파일을 서빙합니다.
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Nginx 설정이 필요하다면 복사 (선택 사항, 기본값 사용 시 생략 가능)
# COPY apps/demo/nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 결과물만 복사
COPY --from=installer /app/apps/demo/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
