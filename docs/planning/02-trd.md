# TRD (기술 요구사항 정의서)

> Vibe Store 기술 아키텍처 및 개발 가이드

---

## MVP 캡슐

| # | 항목 | 내용 |
|---|------|------|
| 1 | 목표 | 라이브 코딩 콘텐츠용 쇼핑몰 스캘레톤 완성 |
| 2 | 페르소나 | 실력이 부족하지만 AI로 커스터마이징 가능한 비개발자 |
| 3 | 핵심 기능 | FEAT-1: 디지털 상품 판매 (리스트/상세/결제/다운로드) |
| 4 | 성공 지표 (노스스타) | 유튜브 구독자 수 (5천 → 1만, 3개월) |
| 5 | 입력 지표 | 라이브 시청자 수, 스캘레톤 다운로드 수 |
| 6 | Out-of-scope | 실물 배송, 코칭 예약 (Phase 2) |
| 7 | Top 리스크 | Supabase RLS 보안 정책 설정 복잡도 |
| 8 | 다음 단계 | 프로젝트 초기 세팅 (Next.js + Supabase) |

---

## 1. 시스템 아키텍처

### 1.1 고수준 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Next.js    │  │  API Routes │  │  Edge Functions         │  │
│  │  (App Router)│  │  (/api/*)   │  │  (Middleware)           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Supabase                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  PostgreSQL │  │  Auth       │  │  Storage                │  │
│  │  (Database) │  │  (인증)     │  │  (파일 저장소)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Row Level Security (RLS)                                   ││
│  │  - 구매자만 파일 접근 가능                                  ││
│  │  - 관리자만 상품 수정 가능                                  ││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │ Toss        │  │ Solapi      │                               │
│  │ Payments    │  │ (알림톡)    │                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 컴포넌트 설명

| 컴포넌트 | 역할 | 왜 이 선택? |
|----------|------|-------------|
| Next.js (App Router) | 풀스택 프레임워크 | SSR/SSG 지원, 라이브 콘텐츠에 적합 |
| Supabase | BaaS (Backend as a Service) | Auth+DB+Storage 통합, 빠른 개발 |
| Vercel | 호스팅 | Next.js 최적화, 자동 배포 |
| Toss Payments | 결제 | 국내 결제 1위, 개발자 친화적 |

---

## 2. 권장 기술 스택

### 2.1 프론트엔드

| 항목 | 선택 | 이유 | 벤더 락인 리스크 |
|------|------|------|-----------------|
| 프레임워크 | Next.js 16 (App Router) | React 기반, SSR/SSG, 라이브 콘텐츠 적합 | 중간 (React 생태계) |
| 언어 | TypeScript | 타입 안전성, AI 코딩 친화적 | 낮음 |
| 스타일링 | Tailwind CSS | 유틸리티 우선, 빠른 개발 | 낮음 |
| 상태관리 | Zustand | 간단하고 직관적 | 낮음 |
| 폼 처리 | React Hook Form + Zod | 성능 좋고 타입 안전 | 낮음 |
| UI 컴포넌트 | shadcn/ui | 복사-붙여넣기, 커스터마이징 쉬움 | 없음 (복사 방식) |

### 2.2 백엔드 (Supabase)

| 항목 | 선택 | 이유 | 벤더 락인 리스크 |
|------|------|------|-----------------|
| 데이터베이스 | PostgreSQL (Supabase) | JSONB 지원, RLS | 중간 (Supabase) |
| 인증 | Supabase Auth | 소셜 로그인 통합, 매직 링크 | 중간 |
| 스토리지 | Supabase Storage | Signed URL, RLS 통합 | 중간 |
| 서버리스 함수 | Supabase Edge Functions | 웹훅 처리, 알림 발송 | 중간 |

### 2.3 외부 서비스

| 서비스 | 용도 | 필수/선택 |
|--------|------|----------|
| Toss Payments | 결제 처리 | 필수 |
| Solapi | 카카오 알림톡 | 선택 (Phase 2) |
| Vercel Analytics | 트래픽 분석 | 선택 |

---

## 3. 비기능 요구사항

### 3.1 성능

| 항목 | 요구사항 | 측정 방법 |
|------|----------|----------|
| FCP (First Contentful Paint) | < 1.5s | Lighthouse |
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| API 응답 시간 | < 500ms (P95) | Vercel Analytics |
| 초기 번들 크기 | < 100KB (gzipped) | Bundle Analyzer |

### 3.2 보안

| 항목 | 요구사항 |
|------|----------|
| 인증 | Supabase Auth (JWT + Refresh Token) |
| 파일 접근 | Signed URL (만료 시간 설정) |
| HTTPS | 필수 (Vercel 자동) |
| 입력 검증 | Zod 스키마 (서버 측 필수) |

### 3.3 확장성

| 항목 | MVP | Phase 2 |
|------|------|---------|
| 동시 사용자 | 100명 | 1,000명 |
| 상품 수 | 50개 | 500개 |
| 파일 저장소 | 10GB | 100GB |

---

## 4. 외부 API 연동

### 4.1 인증 (Supabase Auth)

| 제공자 | 용도 | 필수/선택 |
|--------|------|----------|
| Google OAuth | 소셜 로그인 | 필수 |
| 이메일 매직 링크 | 비밀번호 없이 로그인 | 필수 |

### 4.2 결제 (Toss Payments)

| API | 용도 | 비고 |
|-----|------|------|
| 결제 요청 | 카드/간편결제 | 프론트에서 SDK 호출 |
| 결제 승인 | 서버에서 승인 처리 | API Route에서 처리 |
| 웹훅 | 결제 상태 변경 알림 | Edge Function에서 수신 |

### 4.3 파일 배포 (Supabase Storage)

```typescript
// Signed URL 생성 예시
const { data, error } = await supabase.storage
  .from('downloads')
  .createSignedUrl('product-files/file.pdf', 60 * 60); // 1시간 유효
```

---

## 5. 접근제어 권한 모델

### 5.1 역할 정의

| 역할 | 설명 | 식별 방법 |
|------|------|----------|
| Guest | 비로그인 | auth.uid() IS NULL |
| User | 일반 고객 | auth.uid() IS NOT NULL |
| Admin | 관리자 | profiles.role = 'admin' |

### 5.2 권한 매트릭스

| 리소스 | Guest | User | Admin |
|--------|-------|------|-------|
| 상품 목록 조회 | O | O | O |
| 상품 상세 조회 | O | O | O |
| 장바구니 | - | O (본인) | O |
| 주문 생성 | O (비회원) | O | O |
| 주문 조회 | - | O (본인) | O (전체) |
| 다운로드 | - | O (구매자) | O |
| 상품 관리 | - | - | O |
| 주문 관리 | - | - | O |

### 5.3 RLS 정책 예시

```sql
-- 상품: 모두 조회 가능
CREATE POLICY "Anyone can view active products"
ON products FOR SELECT
USING (status = 'active');

-- 주문: 본인 또는 관리자만 조회
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 다운로드: 구매자만 접근
CREATE POLICY "Purchasers can download"
ON downloads FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE oi.product_id = downloads.product_id
    AND o.user_id = auth.uid()
    AND o.status = 'completed'
  )
);
```

---

## 6. 데이터 생명주기

### 6.1 원칙

- **최소 수집**: 결제에 필요한 최소 정보만 수집
- **명시적 동의**: 마케팅 수신 동의 별도
- **보존 기한**: 법적 의무 (5년) 준수

### 6.2 데이터 흐름

| 데이터 유형 | 보존 기간 | 처리 |
|------------|----------|------|
| 계정 정보 | 탈퇴 후 30일 | 완전 삭제 |
| 주문/결제 | 5년 (전자상거래법) | 보관 후 삭제 |
| 다운로드 기록 | 주문과 동일 | Cascade 삭제 |
| 분석 데이터 | 영구 | 익명화 보관 |

---

## 7. 테스트 전략

### 7.1 테스트 피라미드

| 레벨 | 도구 | 커버리지 목표 |
|------|------|-------------|
| Unit | Vitest | ≥ 80% |
| Integration | Vitest + MSW | Critical paths |
| E2E | Playwright | Key user flows |

### 7.2 테스트 우선순위 (MVP)

1. **결제 플로우**: 결제 요청 → 승인 → 주문 생성
2. **다운로드 권한**: 구매자만 다운로드 가능
3. **RLS 정책**: 권한 없는 접근 차단

### 7.3 품질 게이트

```bash
# 병합 전 필수 통과
npm run lint         # ESLint
npm run type-check   # TypeScript
npm run test         # Vitest
npm run e2e          # Playwright (주요 플로우)
```

---

## 8. API 설계 원칙

### 8.1 라우트 구조

```
/api/
├── auth/
│   ├── callback/        # OAuth 콜백
│   └── verify/          # 이메일 인증
├── categories/
│   ├── [slug]/          # 카테고리별 상품 목록
│   └── route.ts         # 전체 카테고리 트리
├── products/
│   ├── [slug]/          # 상품 상세 (slug 기반)
│   ├── featured/        # 추천 상품 목록
│   └── route.ts         # 상품 목록 (필터, 정렬, 페이지네이션)
├── cart/
│   └── route.ts         # 장바구니 CRUD
├── orders/
│   ├── [id]/            # 주문 상세
│   └── route.ts         # 주문 생성/목록
├── payments/
│   ├── confirm/         # 결제 승인
│   └── webhook/         # 토스 웹훅
├── downloads/
│   └── [id]/            # Signed URL 생성
└── admin/
    ├── categories/      # 카테고리 관리
    ├── products/        # 상품 관리
    └── orders/          # 주문 관리
```

### 8.2 상품 목록 API 쿼리 파라미터

| 파라미터 | 타입 | 설명 | 예시 |
|----------|------|------|------|
| `category` | string | 카테고리 슬러그 | `?category=templates` |
| `tag` | string | 태그 슬러그 | `?tag=next-js` |
| `type` | string | 상품 유형 | `?type=digital` |
| `sort` | string | 정렬 기준 | `?sort=popular` / `newest` / `price_asc` / `price_desc` |
| `page` | number | 페이지 번호 | `?page=2` |
| `limit` | number | 페이지당 개수 | `?limit=12` |
| `featured` | boolean | 추천 상품만 | `?featured=true` |
| `q` | string | 검색어 | `?q=쇼핑몰` |

### 8.3 응답 형식

**성공:**
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "total": 100
  }
}
```

**에러:**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "로그인이 필요합니다."
  }
}
```

---

## 9. 프로젝트 구조

```
vibeShop/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (shop)/             # 고객 페이지
│   │   │   ├── page.tsx        # 홈 (추천 상품, 카테고리)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx    # 상품 목록 (필터, 정렬)
│   │   │   │   └── [slug]/     # 상품 상세 (slug 기반)
│   │   │   ├── categories/
│   │   │   │   └── [slug]/     # 카테고리별 상품
│   │   │   ├── cart/           # 장바구니
│   │   │   ├── checkout/       # 결제
│   │   │   └── my/             # 마이페이지
│   │   ├── admin/              # 관리자 페이지
│   │   │   ├── categories/     # 카테고리 관리
│   │   │   ├── products/       # 상품 관리
│   │   │   └── orders/         # 주문 관리
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   ├── products/           # 상품 관련
│   │   ├── cart/               # 장바구니 관련
│   │   └── layout/             # 레이아웃
│   ├── lib/
│   │   ├── supabase/           # Supabase 클라이언트
│   │   ├── toss/               # 토스페이먼츠 유틸
│   │   └── utils/              # 공통 유틸
│   ├── stores/                 # Zustand 스토어
│   ├── types/                  # TypeScript 타입
│   └── hooks/                  # 커스텀 훅
├── supabase/
│   ├── migrations/             # DB 마이그레이션
│   └── seed.sql                # 시드 데이터
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   └── planning/               # 기획 문서
└── public/
```

---

## 10. 환경 변수

```bash
# .env.local (커밋 X)
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Toss Payments
TOSS_CLIENT_KEY=test_ck_xxx
TOSS_SECRET_KEY=test_sk_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Decision Log

- Supabase 선택 이유: Auth + DB + Storage 통합, RLS 지원
- Next.js App Router 선택: React 19 기능 활용, 스트리밍 SSR
- Toss Payments 선택: 국내 결제 점유율 1위, 문서 품질 우수
- RLS 리스크 인지: 복잡도 높지만, 라이브에서 단계별 설명으로 교육 가치 제공
- **Slug 기반 라우팅**: SEO 최적화 + 사용자 친화적 URL (/products/next-js-template)
- **정렬 옵션**: 인기순(sales_count), 최신순(created_at), 가격순 지원
- **배포 유연성**: Vercel 외에도 Docker, Railway, Render 등 다양한 플랫폼 지원 (Next.js standalone build)
