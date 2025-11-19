# 온프레미스 프론트엔드 모노레포 구축 가이드

## 🤷🏼‍♂️ 개요

### 배경

현재 다수의 프로젝트를 개별 레포지토리(Multi-repo)로 관리하고 있습니다. 이 과정에서 프로젝트 간 설정(ESLint, TSConfig 등)이 파편화되고, 공통 UI 컴포넌트나 유틸리티 코드가 중복 작성되는 비효율이 발생하고 있습니다.

특히 **온프레미스(폐쇄망)** 환경 특성상 외부 의존성 설치가 제한적이고 빌드 리소스가 한정적인데, 프로젝트마다 개별적인 빌드 파이프라인을 유지보수하는 것은 큰 리소스 낭비입니다.

### 목적

흩어진 프론트엔드 프로젝트를 하나의 저장소(Monorepo)로 통합하여 관리 포인트를 일원화하고, 온프레미스 환경에 최적화된 배포 파이프라인을 구축합니다.

### 목표

- **재사용성**: UI 컴포넌트, 유틸리티, 설정을 패키지화하여 모든 앱에서 재사용
- **일관성**: 린트, 포맷팅, 빌드 설정을 통합 관리하여 코드 품질 유지
- **효율성**: `Turborepo`의 캐싱을 활용하여 빌드 시간 단축
- **최적화**: `Docker`와 `turbo prune`을 활용하여 온프레미스 배포 이미지 경량화

---

## 💻 구성하기

### 기존 프로젝트 구성 (Multi-repo)

```text
- project-a (Repository)
  |- src
  |- package.json (React, Config 중복)
  |- Dockerfile (개별 작성)

- project-b (Repository)
  |- src
  |- package.json (React, Config 중복)
  |- Dockerfile (개별 작성)
```

각 프로젝트가 독립적으로 존재하여, 공통 코드를 수정하려면 각 레포지토리를 순회하며 복사-붙여넣기 해야 하는 구조였습니다.

### 멀티모듈 프로젝트 구성 (Monorepo)

```text
- monorepo-root
  |- apps
  |  |- demo        # 실제 서비스 애플리케이션
  |  |- storybook   # 디자인 시스템 문서
  |- packages
  |  |- components  # 공통 UI 컴포넌트 (@design-system/components)
  |  |- tokens      # 디자인 토큰 (@design-system/tokens)
  |  |- tokens-product-1  # 제품별 토큰 (@design-system/tokens-product-1)
  |  |- theme       # Tailwind 테마 (@design-system/theme)
  |- deploy
  |  |- nginx       # 온프레미스 라우팅 설정
  |- package.json   # 워크스페이스 정의
  |- turbo.json     # 빌드 파이프라인 정의
  |- pnpm-workspace.yaml
```

위와 같이 구성하면 다음과 같은 이점이 존재합니다.

- **단일 의존성 관리**: `pnpm`을 통해 모든 프로젝트의 의존성을 효율적으로 설치 및 관리
- **원자적 커밋**: 공통 모듈 수정과 이를 사용하는 앱의 수정을 하나의 커밋으로 처리 가능
- **배포 최적화**: 변경된 앱만 감지하여 빌드 및 배포 수행

---

## ⚙️ 설정 상세

### 1. 워크스페이스 설정 (`pnpm-workspace.yaml`)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

`pnpm`에게 "이 폴더들에 있는 것들을 하나의 프로젝트처럼 관리해줘"라고 알려주는 설정입니다. `apps`에는 실행 가능한 애플리케이션을, `packages`에는 라이브러리 성격의 모듈을 위치시킵니다.

### 2. 빌드 파이프라인 (`turbo.json`)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "storybook-static/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "storybook": {
      "cache": false,
      "persistent": true
    }
  }
}
```

`Turborepo`의 핵심 설정입니다.

- **`dependsOn`: `^build`**: "내 앱을 빌드하기 전에, 내가 의존하고 있는 패키지들(components, tokens 등)을 먼저 빌드해라"라는 의미입니다. 의존성 순서를 자동으로 보장해줍니다.
- **`outputs`**: 빌드 결과물이 어디에 생기는지 정의하여, 다음 빌드 때 캐싱(재사용)할 수 있게 합니다. `storybook-static/**`도 포함하여 Storybook 빌드 결과도 캐싱합니다.
- **`lint`**: 린트 작업도 의존성 순서를 보장하여 실행됩니다.

### 3. 온프레미스 배포 전략 (`Dockerfile`)

온프레미스 환경에서는 **이미지 용량**과 **빌드 안정성**이 중요합니다. 이를 위해 `turbo prune` 기능을 활용한 Multi-stage 빌드를 적용했습니다.

```dockerfile
FROM node:18-alpine AS base

# 1. Prune Stage: 필요한 것만 골라내기
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune --scope=demo --docker

# 2. Install & Build Stage: 설치하고 빌드하기
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable

# 의존성 설치 (Lockfile 활용)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# 소스 코드 복사 및 빌드
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=demo...

# 3. Runner Stage: 실행하기 (Nginx)
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html
COPY --from=installer /app/apps/demo/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**왜 이렇게 복잡하게 하나요?**
일반적으로 `COPY . .`을 하면 모노레포의 모든 소스(다른 앱 포함)가 들어갑니다. `turbo prune`은 `demo` 앱을 실행하는 데 **필요한 코드와 의존성만 쏙 골라내어(Isolate)** `out` 폴더에 만들어줍니다. 이를 통해 도커 이미지 크기를 획기적으로 줄일 수 있습니다.

### 4. 라우팅 설정 (`Nginx`)

단일 진입점에서 여러 앱을 서빙하기 위해 Nginx를 리버스 프록시로 둡니다.

#### 메인 설정 (deploy/nginx/nginx.conf)

```nginx
http {
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

    # Upstream 설정
    upstream storybook {
        server storybook:80 max_fails=3 fail_timeout=30s;
    }
    upstream demo {
        server demo:80 max_fails=3 fail_timeout=30s;
    }

    include /etc/nginx/conf.d/*.conf;
}
```

#### 가상 호스트 설정 (deploy/nginx/conf.d/default.conf)

```nginx
server {
    listen 80;
    server_name _;

    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate Limiting 적용
    limit_req zone=general burst=20 nodelay;

    # Storybook (기본)
    location / {
        proxy_pass http://storybook/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Demo App
    location /demo {
        proxy_pass http://demo/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 헬스체크
    location /health {
        return 200 "healthy\n";
    }
}
```

새로운 앱이 추가되면:
1. `docker-compose.yml`에 컨테이너를 추가
2. `deploy/nginx/nginx.conf`에 upstream 추가
3. `deploy/nginx/conf.d/default.conf`에 location 추가

이렇게 하면 즉시 서비스가 가능합니다.

---

## 🚀 심화 개념

### pnpm과 유령 의존성(Phantom Dependency)

기존 `npm`이나 `yarn`은 `node_modules`를 평평하게(Flat) 만들어, 내가 설치하지 않은 패키지도 우연히 참조할 수 있는 '유령 의존성' 문제가 있었습니다.
**pnpm**은 심볼릭 링크를 사용하여 의존성 구조를 엄격하게 관리합니다. 이는 모노레포에서 A앱의 의존성을 B앱이 몰래 가져다 쓰는 실수를 원천 차단해줍니다.

### Docker 캐싱과 Layer

`Dockerfile`에서 `COPY` 순서는 매우 중요합니다.

1.  `out/json/` (package.json 등)을 먼저 복사하고 `pnpm install`을 합니다.
2.  그 다음 `out/full/` (소스 코드)을 복사합니다.

이렇게 분리하면, 소스 코드만 수정했을 때는 **무거운 `pnpm install` 과정을 건너뛰고(캐시 사용)** 바로 빌드만 수행하여 배포 속도가 매우 빨라집니다.

---

## 📚 추가 자료

온프레미스 환경을 고려한 최적화 기법에 대한 자세한 내용은 [온프레미스 환경 최적화 가이드](./ONPREMISE.md)를 참고하세요.

주요 내용:
- 이미지 최적화 (turbo prune, 멀티 스테이지 빌드)
- 리소스 관리 (메모리/CPU 제한)
- 보안 강화 (보안 헤더, Rate Limiting)
- 안정성 보장 (헬스체크, 자동 재시작)
- 폐쇄망 대응 (Lockfile 고정, 버전 고정)
- 운영 자동화 (배포/백업 스크립트)
