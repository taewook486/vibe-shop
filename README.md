# Vibe Store

바이브랩스 유튜브 채널의 라이브 코딩 콘텐츠용 디지털 상품 쇼핑몰 스캘레톤입니다.

## 주요 기능

- 상품 조회 및 상세 정보
- 장바구니 관리
- 결제 처리 (Toss Payments)
- 사용자 인증 (Supabase Auth)
- 관리자 대시보드
- 주문 관리

## 기술 스택

| 항목 | 기술 |
|------|------|
| Frontend | Next.js 15 (App Router) |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Authentication | NextAuth.js (Auth.js v5) + Supabase DB |
| Payments | Toss Payments |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State Management | Zustand |
| Deployment | Vercel, Docker, Railway |

## 빠른 시작

### 요구사항

- Node.js 20 이상
- npm 또는 yarn
- Git

### 설치

```bash
# 1. 리포지토리 클론
git clone https://github.com/your-username/vibeShop.git
cd vibeShop

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일 편집 후 필수 정보 입력
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 방문

### 빌드

```bash
npm run build
npm start
```

## 환경 변수 설정

### 필수 변수 (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Toss Payments
TOSS_CLIENT_KEY=your_client_key
TOSS_SECRET_KEY=your_secret_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth.js (Auth.js v5)
AUTH_SECRET=your_random_secret  # openssl rand -base64 32
AUTH_URL=http://localhost:3000
```

### 환경 변수 얻는 방법

1. **Supabase**: [supabase.com](https://supabase.com)에서 프로젝트 생성 후 API 키 복사
2. **Toss Payments**: [toss.im](https://toss.im)에서 사업자 계정 생성 후 API 키 복사
3. **AUTH_SECRET**: 터미널에서 `openssl rand -base64 32` 실행하여 생성

## 개발 도구

### 린팅

```bash
npm run lint
```

### 타입 체크

```bash
npm run type-check
```

### 테스트

```bash
# 단일 실행
npm run test

# 파일 변경 감지 모드
npm run test:watch

# UI 대시보드
npm run test:ui
```

## 프로젝트 구조

```
vibeShop/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (shop)/             # 고객 페이지 (라우트 그룹)
│   │   ├── admin/              # 관리자 페이지
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── products/           # 상품 관련 컴포넌트
│   │   └── cart/               # 장바구니 관련 컴포넌트
│   ├── lib/
│   │   ├── supabase/           # Supabase 클라이언트
│   │   └── toss/               # 토스페이먼츠 유틸
│   ├── stores/                 # Zustand 스토어
│   ├── types/                  # TypeScript 타입
│   └── hooks/                  # 커스텀 훅
├── supabase/
│   └── migrations/             # DB 마이그레이션
├── tests/                      # 테스트 파일
├── docs/
│   ├── planning/               # 기획 문서
│   └── deployment/             # 배포 가이드
├── Dockerfile                  # Docker 이미지
├── docker-compose.yml          # Docker Compose 설정
└── README.md                   # 이 파일
```

## 배포

### 배포 옵션

Vibe Store를 배포할 수 있는 여러 옵션이 있습니다:

#### 1. Vercel (권장)

Next.js 제작자가 운영하는 플랫폼으로, 최고의 성능과 간단한 설정을 제공합니다.

```bash
# 자세한 가이드는 docs/deployment/vercel.md 참조
```

**장점:**
- 무료 플랜 지원
- Next.js 최적화
- 엣지 함수 지원
- 0초 다운타임

**배포**: https://vercel.com/new 에서 GitHub 리포지토리 선택

#### 2. Docker + Cloud Run/ECS

Docker 컨테이너로 배포하여 원하는 클라우드에 배포할 수 있습니다.

```bash
# Docker 이미지 빌드
npm run build:docker

# 로컬에서 테스트
npm run docker:run

# Docker Compose로 실행
npm run docker:compose
```

**자세한 가이드:**
- Docker: `docs/deployment/docker.md`
- Railway: `docs/deployment/railway.md`

#### 3. Railway

간단한 원클릭 배포를 지원합니다.

```bash
# Railway 대시보드에서 GitHub 리포지토리 선택하면 자동 배포
```

**자세한 가이드**: `docs/deployment/railway.md`

### 배포 체크리스트

배포 전에 다음을 확인하세요:

- [ ] 모든 환경 변수 설정 완료
- [ ] `npm run build` 성공
- [ ] `npm run type-check` 통과
- [ ] `npm run lint` 통과
- [ ] `npm run test` 통과
- [ ] 데이터베이스 마이그레이션 완료
- [ ] 보안 설정 검토 완료

## 배포 가이드 문서

더 자세한 배포 정보는 다음을 참조하세요:

| 플랫폼 | 가이드 |
|--------|--------|
| Vercel | [docs/deployment/vercel.md](docs/deployment/vercel.md) |
| Docker | [docs/deployment/docker.md](docs/deployment/docker.md) |
| Railway | [docs/deployment/railway.md](docs/deployment/railway.md) |

## API 문서

### 인증 API (NextAuth.js)

```
GET  /api/auth/providers      # 사용 가능한 인증 방법 조회
GET  /api/auth/session        # 현재 세션 조회
GET  /api/auth/csrf           # CSRF 토큰 조회
POST /api/auth/signin         # 로그인
POST /api/auth/signout        # 로그아웃
POST /api/auth/callback       # OAuth 콜백
```

### 상품 API

```
GET /api/products
GET /api/products/:id
POST /api/products (관리자)
PUT /api/products/:id (관리자)
DELETE /api/products/:id (관리자)
```

### 주문 API

```
POST /api/orders
GET /api/orders/:id
GET /api/orders (관리자)
```

더 자세한 API 문서는 [http://localhost:3000/docs](http://localhost:3000/docs) 참조 (개발 중)

## 코딩 컨벤션

이 프로젝트의 코딩 컨벤션을 준수해주세요:

- **커밋 메시지**: Conventional Commits
  - `feat(products): 상품 상세 페이지 구현`
  - `fix(cart): 수량 변경 버그 수정`
- **파일 네이밍**: kebab-case (`product-card.tsx`)
- **컴포넌트**: PascalCase (`ProductCard`)
- **서버 컴포넌트 우선**: 클라이언트 컴포넌트는 필요한 경우만 사용

더 자세한 정보는 [docs/planning/07-coding-convention.md](docs/planning/07-coding-convention.md) 참조

## 기획 문서

프로젝트 기획 및 설계 문서는 `docs/planning/` 디렉토리에 있습니다:

| 문서 | 내용 |
|------|------|
| [01-prd.md](docs/planning/01-prd.md) | 제품 요구사항 명세 |
| [02-trd.md](docs/planning/02-trd.md) | 기술 명세 문서 |
| [03-user-flow.md](docs/planning/03-user-flow.md) | 사용자 여정 |
| [04-database-design.md](docs/planning/04-database-design.md) | 데이터베이스 설계 |
| [05-design-system.md](docs/planning/05-design-system.md) | 디자인 시스템 |
| [06-tasks.md](docs/planning/06-tasks.md) | 태스크 목록 및 일정 |
| [07-coding-convention.md](docs/planning/07-coding-convention.md) | 코딩 컨벤션 |
| [08-wireframe.md](docs/planning/08-wireframe.md) | 와이어프레임 |

## 문제 해결

### 환경 변수 에러

```
Error: Missing environment variable: NEXT_PUBLIC_SUPABASE_URL
```

**해결책:**
1. `.env.local` 파일 확인
2. 모든 필수 변수가 설정되었는지 확인
3. 파일 저장 후 개발 서버 재시작

### 데이터베이스 연결 에러

```
Error: Database connection failed
```

**해결책:**
1. Supabase 프로젝트 상태 확인
2. `NEXT_PUBLIC_SUPABASE_URL` 과 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 확인
3. 방화벽 설정 확인

### 빌드 실패

```bash
# 캐시 삭제 후 다시 시도
rm -rf .next node_modules
npm install
npm run build
```

## 기여

이 프로젝트에 기여하고 싶으시면:

1. Fork 프로젝트
2. Feature branch 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'feat: add amazing feature'`)
4. Branch에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 지원 및 문의

- YouTube: [바이브랩스](https://www.youtube.com/@vibelabs)
- 이메일: support@vibeshop.com
- Issues: [GitHub Issues](https://github.com/your-username/vibeShop/issues)

## 변경 로그

### v0.1.0 (2026-01-26)

- 초기 프로젝트 구조 설정
- NextAuth.js (Auth.js v5) 설치 및 기본 설정
- Credentials Provider 구현 (이메일/비밀번호)
- Supabase DB와 연동
- 세션에 role (customer/admin) 추가

자세한 변경사항은 [CHANGELOG.md](CHANGELOG.md) 참조

---

**Happy Coding! 🎉**

라이브 코딩 콘텐츠로 함께 성장해요. 구독과 좋아요는 큰 힘이 됩니다!
