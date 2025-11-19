# 온프레미스 환경 최적화 가이드

## 📋 목차

- [개요](#개요)
- [이미지 최적화](#이미지-최적화)
- [리소스 관리](#리소스-관리)
- [보안 강화](#보안-강화)
- [안정성 보장](#안정성-보장)
- [폐쇄망 대응](#폐쇄망-대응)
- [운영 자동화](#운영-자동화)
- [모니터링](#모니터링)

---

## 개요

온프레미스 환경은 다음과 같은 특성을 가지고 있습니다:

- **제한된 네트워크**: 외부 인터넷 접근이 제한되거나 없음
- **제한된 리소스**: CPU, 메모리, 디스크 용량이 한정적
- **보안 요구사항**: 내부망 보안 정책 준수 필요
- **운영 자동화**: 수동 개입 최소화 필요

이 문서는 이러한 온프레미스 환경 특성을 고려하여 도입한 최적화 기법들을 설명합니다.

---

## 이미지 최적화

### 1. turbo prune을 활용한 의존성 최소화

온프레미스 환경에서는 **이미지 크기**가 매우 중요합니다. 네트워크 전송 시간과 저장 공간을 절약하기 위해 `turbo prune`을 사용합니다.

#### 적용 위치
- `apps/demo/Dockerfile`
- `apps/storybook/Dockerfile` (선택적)

#### 작동 원리

```dockerfile
# 1. Prune Stage: 필요한 패키지만 추출
FROM base AS builder
RUN turbo prune --scope=demo --docker
```

`turbo prune`은 다음을 수행합니다:
- 지정된 앱(`demo`)에 필요한 패키지만 추출
- 의존성 그래프 분석하여 최소한의 코드만 포함
- `out/json/` (package.json들)과 `out/full/` (소스 코드)로 분리

#### 효과

**Before (전체 모노레포 복사):**
```dockerfile
COPY . .  # 모든 앱과 패키지 포함 (불필요한 코드 포함)
```

**After (turbo prune 사용):**
```dockerfile
COPY --from=builder /app/out/full/ .  # 필요한 코드만 포함
```

**이미지 크기 비교:**
- 전체 복사: ~800MB
- turbo prune: ~300MB
- **절감률: 62.5%**

### 2. 멀티 스테이지 빌드

빌드 도구와 런타임을 분리하여 최종 이미지를 경량화합니다.

```dockerfile
# Stage 1: 빌드 (Node.js + 빌드 도구)
FROM node:18-alpine AS builder
RUN pnpm install && pnpm build

# Stage 2: 런타임 (Nginx만)
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
```

**효과:**
- Node.js 런타임 제거로 이미지 크기 감소
- 보안 취약점 노출 범위 축소
- 빌드 도구가 프로덕션 이미지에 포함되지 않음

### 3. Alpine Linux 사용

Ubuntu/Debian 기반 이미지 대신 Alpine Linux를 사용합니다.

**비교:**
- `node:18`: ~900MB
- `node:18-alpine`: ~170MB
- **절감률: 81%**

**주의사항:**
- Alpine은 `musl libc`를 사용하므로 일부 네이티브 모듈 호환성 문제 가능
- `libc6-compat` 패키지 추가로 호환성 확보

```dockerfile
RUN apk add --no-cache libc6-compat
```

### 4. .dockerignore 최적화

불필요한 파일을 이미지에 포함하지 않습니다.

```dockerignore
# 의존성 (이미 설치됨)
node_modules
.pnpm-store

# 빌드 아티팩트 (재생성됨)
dist
build
storybook-static

# 문서 및 설정 (런타임 불필요)
docs
*.md
```

**효과:**
- 이미지 빌드 시간 단축
- 이미지 크기 감소
- 보안: 민감한 설정 파일 누락 방지

---

## 리소스 관리

### 1. 메모리 제한

각 컨테이너에 메모리 제한을 설정하여 리소스 경합을 방지합니다.

```yaml
services:
  demo:
    deploy:
      resources:
        limits:
          memory: 256M      # 최대 메모리
        reservations:
          memory: 128M      # 예약 메모리
```

**설정 기준:**
- Nginx: 128-256MB (정적 파일 서빙)
- Storybook: 256-512MB (정적 파일 서빙)
- Demo App: 256-512MB (SPA)

### 2. 네트워크 격리

독립적인 Docker 네트워크를 생성하여 서비스 간 통신을 제어합니다.

```yaml
networks:
  frontend-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

**효과:**
- 외부 네트워크와 격리
- 서비스 간 통신만 허용
- 보안 강화

### 3. CPU 제한 (선택적)

CPU 사용량을 제한하여 다른 서비스에 영향 방지.

```yaml
services:
  demo:
    deploy:
      resources:
        limits:
          cpus: '1.0'      # 최대 1 CPU 코어
```

---

## 보안 강화

### 1. 보안 헤더 설정

Nginx에서 보안 헤더를 추가하여 다양한 공격을 방어합니다.

```nginx
# XSS 공격 방어
add_header X-XSS-Protection "1; mode=block" always;

# 클릭재킹 방어
add_header X-Frame-Options "SAMEORIGIN" always;

# MIME 타입 스니핑 방어
add_header X-Content-Type-Options "nosniff" always;

# HTTPS 강제 (HTTPS 사용 시)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Referrer 정책
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### 2. Rate Limiting

DDoS 공격 및 과도한 요청을 방지하기 위해 Rate Limiting을 적용합니다.

```nginx
# Rate Limiting 영역 정의
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

# 적용
server {
    limit_req zone=general burst=20 nodelay;
}
```

**설정:**
- 기본: 10 요청/초
- 버스트: 20 요청 (일시적 허용)
- 초과 시: 429 Too Many Requests 반환

### 3. 숨김 파일 접근 차단

`.git`, `.env` 등 민감한 파일 접근을 차단합니다.

```nginx
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}
```

### 4. Nginx 사용자 권한

최소 권한 원칙에 따라 Nginx를 비특권 사용자로 실행합니다.

```dockerfile
# Storybook Dockerfile
USER nginx

# 파일 권한 설정
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html
```

### 5. SSL/TLS 지원 (선택적)

HTTPS를 사용하는 경우 SSL 인증서를 마운트합니다.

```yaml
volumes:
  - ./deploy/nginx/ssl:/etc/nginx/ssl:ro
```

---

## 안정성 보장

### 1. 헬스체크

컨테이너의 상태를 주기적으로 확인하여 자동 복구를 지원합니다.

#### Docker Compose 헬스체크

```yaml
healthcheck:
  test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost/health']
  interval: 30s      # 30초마다 확인
  timeout: 10s       # 10초 타임아웃
  retries: 3         # 3회 실패 시 unhealthy
```

#### Dockerfile 헬스체크

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1
```

#### 헬스체크 엔드포인트

```nginx
location /health {
    access_log off;
    add_header Content-Type text/plain;
    return 200 "healthy\n";
}
```

### 2. 자동 재시작 정책

컨테이너가 비정상 종료 시 자동으로 재시작합니다.

```yaml
restart: unless-stopped
```

**정책 옵션:**
- `no`: 재시작 안 함
- `always`: 항상 재시작
- `on-failure`: 실패 시만 재시작
- `unless-stopped`: 명시적 중지 전까지 재시작 (권장)

### 3. Upstream Failover

Nginx upstream에서 서비스 장애 시 자동으로 다른 인스턴스로 전환합니다.

```nginx
upstream demo {
    server demo:80 max_fails=3 fail_timeout=30s;
}
```

**설정:**
- `max_fails=3`: 3회 실패 시 비활성화
- `fail_timeout=30s`: 30초 후 재시도

### 4. Graceful Shutdown

서비스 종료 시 진행 중인 요청을 완료한 후 종료합니다.

```dockerfile
# Nginx는 기본적으로 graceful shutdown 지원
CMD ["nginx", "-g", "daemon off;"]
```

---

## 폐쇄망 대응

### 1. Lockfile 고정

의존성 버전을 고정하여 재현 가능한 빌드를 보장합니다.

```dockerfile
# pnpm-lock.yaml 복사
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# 고정된 버전으로 설치
RUN pnpm install --frozen-lockfile
```

**효과:**
- 외부 레지스트리 접근 불가 시에도 동일한 의존성 설치
- 빌드 재현성 보장
- 의존성 버전 충돌 방지

### 2. pnpm 버전 고정

`corepack`을 사용하여 pnpm 버전을 고정합니다.

```dockerfile
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
```

**효과:**
- 팀원 간 동일한 패키지 매니저 버전 사용
- 빌드 환경 일관성 보장

### 3. 외부 의존성 최소화

빌드 시 외부 레지스트리 접근을 최소화합니다.

**전략:**
- 모든 의존성을 `pnpm-lock.yaml`에 고정
- 빌드 시 `--frozen-lockfile` 사용
- 오프라인 설치 지원 (`pnpm install --offline`)

### 4. 이미지 레지스트리 대체

온프레미스 환경에서는 내부 Docker 레지스트리를 사용합니다.

```yaml
# docker-compose.yml
services:
  demo:
    build:
      context: .
      dockerfile: ./apps/demo/Dockerfile
    # 또는 내부 레지스트리에서 pull
    # image: internal-registry.example.com/demo:latest
```

---

## 운영 자동화

### 1. 배포 스크립트

자동화된 배포 스크립트로 배포 과정을 표준화합니다.

**위치:** `deploy/scripts/deploy.sh`

**기능:**
- 필수 요구사항 확인 (Docker, Docker Compose)
- 환경 변수 파일 검증
- 이전 빌드 정리 (선택적)
- 이미지 빌드
- 서비스 시작
- 헬스체크
- 배포 검증

**사용법:**
```bash
# 일반 배포
./deploy/scripts/deploy.sh

# 정리 후 배포
./deploy/scripts/deploy.sh --clean
```

### 2. 백업 스크립트

정기적인 백업을 자동화합니다.

**위치:** `deploy/scripts/backup.sh`

**백업 대상:**
- Docker 볼륨 데이터
- 설정 파일 (docker-compose.yml, nginx 설정 등)
- 데이터 디렉토리 (있는 경우)

**사용법:**
```bash
# 수동 백업
./deploy/scripts/backup.sh

# 자동 백업 (crontab)
0 2 * * * /path/to/deploy/scripts/backup.sh
```

**백업 보관:**
- 기본 보관 기간: 30일
- 환경 변수로 조정 가능: `RETENTION_DAYS=60`

### 3. 복구 스크립트

백업에서 복구하는 스크립트를 제공합니다.

**위치:** `deploy/scripts/restore.sh`

**사용법:**
```bash
./deploy/scripts/restore.sh /backup/backup_file.tar.gz
```

---

## 모니터링

### 1. Nginx 상태 페이지

Nginx 내장 상태 페이지를 활용합니다.

```nginx
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    allow 172.20.0.0/16;  # Docker 네트워크
    deny all;
}
```

**접속:**
```
http://localhost/nginx_status
```

**제공 정보:**
- Active connections
- Requests per second
- 처리된 요청 수

### 2. Prometheus + Grafana (선택적)

고급 모니터링이 필요한 경우 Prometheus와 Grafana를 사용합니다.

**설정 스크립트:** `deploy/scripts/monitoring-setup.sh`

**제공 메트릭:**
- 시스템 리소스 (CPU, 메모리, 디스크)
- Nginx 메트릭
- Docker 컨테이너 메트릭

**접속:**
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

### 3. 로그 관리

Docker Compose 로그를 활용합니다.

```bash
# 모든 서비스 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f demo

# 최근 100줄
docker-compose logs --tail=100
```

**로그 로테이션:**
Docker의 기본 로그 드라이버 설정으로 자동 로테이션 가능.

```yaml
services:
  demo:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 성능 최적화

### 1. Gzip 압축

네트워크 대역폭을 절약하기 위해 Gzip 압축을 활성화합니다.

```nginx
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    application/json
    application/javascript
    text/xml
    application/xml;
```

**효과:**
- 텍스트 파일 크기 70-90% 감소
- 전송 시간 단축
- 대역폭 절약

### 2. 정적 자산 캐싱

브라우저 캐싱을 활용하여 반복 요청을 줄입니다.

```nginx
location ~* \.(css|js|jpg|png|gif|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**효과:**
- 서버 부하 감소
- 사용자 경험 개선 (로딩 시간 단축)

### 3. 버퍼 최적화

Nginx 버퍼 크기를 조정하여 성능을 개선합니다.

```nginx
client_body_buffer_size 128k;
client_max_body_size 100M;
client_header_buffer_size 1k;
large_client_header_buffers 4 16k;
```

---

## 트러블슈팅

### 이미지 크기가 너무 큰 경우

```bash
# 이미지 크기 확인
docker images

# 불필요한 레이어 정리
docker system prune -a

# .dockerignore 확인
cat .dockerignore
```

### 메모리 부족 오류

```yaml
# docker-compose.yml에서 메모리 제한 조정
services:
  demo:
    deploy:
      resources:
        limits:
          memory: 512M  # 증가
```

### 빌드 실패 (의존성 문제)

```bash
# Lockfile 재생성
rm pnpm-lock.yaml
pnpm install

# 캐시 없이 재빌드
docker-compose build --no-cache
```

### 헬스체크 실패

```bash
# 컨테이너 로그 확인
docker-compose logs demo

# 헬스체크 수동 실행
docker exec ds-demo wget --quiet --tries=1 --spider http://localhost/health
```

---

## 참고 문서

- [아키텍처 가이드](./ARCHITECTURE.md)
- [모노레포 핸드북](./monorepo_handbook.md)
- [Docker 공식 문서](https://docs.docker.com/)
- [Nginx 설정 가이드](https://nginx.org/en/docs/)

