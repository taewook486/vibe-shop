# Coding Convention & AI Collaboration Guide

> Vibe Store 개발을 위한 코딩 컨벤션 및 AI 협업 가이드

---

## MVP 캡슐

| # | 항목 | 내용 |
|---|------|------|
| 1 | 목표 | 라이브 코딩 콘텐츠용 쇼핑몰 스캘레톤 완성 |
| 2 | 페르소나 | 실력이 부족하지만 AI로 커스터마이징 가능한 비개발자 |
| 3 | 핵심 기능 | FEAT-1: 디지털 상품 판매 (리스트/상세/결제/다운로드) |
| 4 | 성공 지표 (노스스타) | 유튜브 구독자 수 (5천 → 1만, 3개월) |
| 5 | 입력 지표 | 라이브 시청자 수, 스캘레톤 다운로드 수 |
| 6 | 비기능 요구 | Supabase RLS 기반 보안 |
| 7 | Out-of-scope | 실물 배송, 코칭 예약 (Phase 2) |
| 8 | Top 리스크 | Supabase RLS 보안 정책 설정 복잡도 |
| 9 | 완화/실험 | RLS 정책 템플릿화 + 라이브에서 단계별 설명 |
| 10 | 다음 단계 | 프로젝트 초기 세팅 (Next.js + Supabase) |

---

## 1. 핵심 원칙

### 1.1 라이브 코딩을 위한 코드

이 프로젝트는 **라이브 코딩 콘텐츠**로 사용됩니다. 따라서:

- **읽기 쉬운 코드**: 시청자가 따라올 수 있도록 명확하게
- **단계별 구현**: 한 번에 너무 많이 하지 않기
- **주석 활용**: 핵심 로직에는 한글 주석 추가
- **에러 처리 명시**: 에러 상황을 건너뛰지 않기

### 1.2 AI 커스터마이징을 위한 코드

스캘레톤을 받아가는 사용자는 **AI와 함께 수정**합니다:

- **구조화된 코드**: AI가 이해하기 쉬운 패턴
- **분리된 모듈**: 한 파일에 한 가지 책임
- **명확한 타입**: TypeScript로 의도 표현
- **상수 분리**: 수정할 값은 한 곳에 모으기

### 1.3 신뢰하되, 검증하라

AI가 생성한 코드는 반드시 검증:

- [ ] 코드 리뷰: 생성된 코드 직접 확인
- [ ] 테스트 실행: 자동화 테스트 통과 확인
- [ ] 보안 검토: 민감 정보 노출 여부 확인
- [ ] 동작 확인: 실제로 실행하여 기대 동작 확인

---

## 2. 프로젝트 구조

### 2.1 디렉토리 구조

```
vibeShop/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (shop)/                 # 고객 페이지 (라우트 그룹)
│   │   │   ├── page.tsx            # 홈
│   │   │   ├── products/
│   │   │   │   ├── page.tsx        # 상품 목록
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # 상품 상세
│   │   │   ├── cart/
│   │   │   │   └── page.tsx        # 장바구니
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx        # 결제
│   │   │   │   └── success/
│   │   │   │       └── page.tsx    # 결제 완료
│   │   │   └── my/
│   │   │       ├── page.tsx        # 마이페이지
│   │   │       ├── orders/
│   │   │       │   └── page.tsx    # 주문 내역
│   │   │       └── downloads/
│   │   │           └── page.tsx    # 다운로드 센터
│   │   │
│   │   ├── admin/                  # 관리자 페이지
│   │   │   ├── page.tsx            # 대시보드
│   │   │   ├── products/
│   │   │   └── orders/
│   │   │
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   └── downloads/
│   │   │
│   │   ├── layout.tsx              # 루트 레이아웃
│   │   └── globals.css             # 전역 스타일
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui 기본 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── layout/                 # 레이아웃 컴포넌트
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── nav.tsx
│   │   ├── products/               # 상품 관련 컴포넌트
│   │   │   ├── product-card.tsx
│   │   │   ├── product-grid.tsx
│   │   │   └── product-detail.tsx
│   │   ├── cart/                   # 장바구니 관련
│   │   │   ├── cart-item.tsx
│   │   │   └── cart-summary.tsx
│   │   └── admin/                  # 관리자 컴포넌트
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # 브라우저 클라이언트
│   │   │   ├── server.ts           # 서버 클라이언트
│   │   │   └── middleware.ts       # 미들웨어 클라이언트
│   │   ├── toss/
│   │   │   └── payments.ts         # 토스페이먼츠 유틸
│   │   ├── utils/
│   │   │   ├── format.ts           # 포맷팅 (가격, 날짜)
│   │   │   └── validation.ts       # 유효성 검사
│   │   └── constants.ts            # 상수 정의
│   │
│   ├── stores/                     # Zustand 스토어
│   │   ├── cart-store.ts
│   │   └── auth-store.ts
│   │
│   ├── types/                      # TypeScript 타입
│   │   ├── database.ts             # Supabase 생성 타입
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── index.ts
│   │
│   └── hooks/                      # 커스텀 훅
│       ├── use-cart.ts
│       ├── use-auth.ts
│       └── use-products.ts
│
├── supabase/
│   ├── migrations/                 # DB 마이그레이션
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_products.sql
│   │   └── ...
│   └── seed.sql                    # 시드 데이터
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   └── planning/                   # 기획 문서
│
└── public/
    └── images/
```

### 2.2 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| **파일 (컴포넌트)** | kebab-case | `product-card.tsx` |
| **파일 (유틸/훅)** | kebab-case | `use-cart.ts` |
| **컴포넌트** | PascalCase | `ProductCard` |
| **함수** | camelCase | `getProducts` |
| **변수** | camelCase | `cartItems` |
| **상수** | UPPER_SNAKE | `MAX_QUANTITY` |
| **타입/인터페이스** | PascalCase | `Product`, `CartItem` |
| **DB 테이블** | snake_case | `order_items` |
| **DB 컬럼** | snake_case | `created_at` |

### 2.3 파일 구조 규칙

**컴포넌트 파일:**
```tsx
// 1. 임포트 (외부 → 내부 순)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/format';
import type { Product } from '@/types';

// 2. 타입 정의
interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

// 3. 컴포넌트
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // 상태
  const [isLoading, setIsLoading] = useState(false);

  // 핸들러
  const handleClick = () => {
    // ...
  };

  // 렌더링
  return (
    <div>...</div>
  );
}
```

---

## 3. TypeScript 규칙

### 3.1 타입 정의

```typescript
// types/product.ts

// 기본 타입 (DB 스키마 기반)
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  type: 'digital' | 'physical' | 'service';
  status: 'draft' | 'active' | 'archived' | 'hidden';
  metadata: ProductMetadata;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

// 타입별 메타데이터
export interface DigitalProductMetadata {
  file_format: string;
  file_size: string;
  preview_url?: string;
}

export interface PhysicalProductMetadata {
  weight: number;
  stock: number;
  shipping_fee: number;
}

// 유니온 타입
export type ProductMetadata =
  | DigitalProductMetadata
  | PhysicalProductMetadata
  | Record<string, unknown>;

// API 응답 타입
export interface ProductsResponse {
  data: Product[];
  meta: {
    page: number;
    total: number;
  };
}
```

### 3.2 Supabase 타입 생성

```bash
# Supabase CLI로 타입 자동 생성
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

### 3.3 Zod 스키마 (검증)

```typescript
// lib/validations/product.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, '상품명을 입력하세요').max(200),
  description: z.string().optional(),
  price: z.number().min(0, '가격은 0 이상이어야 합니다'),
  type: z.enum(['digital', 'physical', 'service']),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
```

---

## 4. React/Next.js 규칙

### 4.1 서버 컴포넌트 우선

```tsx
// app/products/page.tsx (서버 컴포넌트)
import { createServerClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/products/product-grid';

export default async function ProductsPage() {
  const supabase = createServerClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active');

  return <ProductGrid products={products ?? []} />;
}
```

### 4.2 클라이언트 컴포넌트 분리

```tsx
// components/cart/add-to-cart-button.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await addItem(productId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? '추가 중...' : '장바구니 담기'}
    </Button>
  );
}
```

### 4.3 에러 처리

```tsx
// app/products/[id]/error.tsx
'use client';

import { Button } from '@/components/ui/button';

export default function ProductError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900">
        상품을 불러올 수 없습니다
      </h2>
      <p className="mt-2 text-gray-500">
        {error.message}
      </p>
      <Button onClick={reset} className="mt-4">
        다시 시도
      </Button>
    </div>
  );
}
```

---

## 5. API 라우트 규칙

### 5.1 구조

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = 12;

    const { data, count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return NextResponse.json({
      data,
      meta: { page, total: count ?? 0 },
    });
  } catch (error) {
    console.error('상품 조회 실패:', error);
    return NextResponse.json(
      { error: { code: 'FETCH_ERROR', message: '상품을 불러올 수 없습니다' } },
      { status: 500 }
    );
  }
}

// POST /api/products (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // 관리자 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다' } },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: '권한이 없습니다' } },
        { status: 403 }
      );
    }

    // 상품 생성
    const body = await request.json();
    // ... 검증 및 저장

    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch (error) {
    // ...
  }
}
```

### 5.2 응답 형식

```typescript
// 성공
{
  data: { ... },
  meta?: { page: 1, total: 100 }
}

// 에러
{
  error: {
    code: 'ERROR_CODE',
    message: '사용자에게 보여줄 메시지',
    details?: [...]
  }
}
```

---

## 6. Supabase 클라이언트

### 6.1 클라이언트 종류

```typescript
// lib/supabase/client.ts - 브라우저용
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts - 서버 컴포넌트용
import { createServerClient as _createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerClient() {
  const cookieStore = cookies();

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // 서버 컴포넌트에서 호출 시 무시
          }
        },
      },
    }
  );
}
```

### 6.2 쿼리 패턴

```typescript
// 목록 조회 (페이지네이션)
const { data, count } = await supabase
  .from('products')
  .select('*', { count: 'exact' })
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .range(0, 11);

// 상세 조회 (관계 포함)
const { data } = await supabase
  .from('products')
  .select(`
    *,
    product_files (*)
  `)
  .eq('id', productId)
  .single();

// 생성
const { data, error } = await supabase
  .from('products')
  .insert({ name, price, type })
  .select()
  .single();

// 수정
const { error } = await supabase
  .from('products')
  .update({ name, price })
  .eq('id', productId);
```

---

## 7. 보안 체크리스트

### 7.1 절대 금지

- [ ] 비밀정보 하드코딩 금지 (API 키, 비밀번호)
- [ ] `.env` 파일 커밋 금지 (`.gitignore` 확인)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 클라이언트 노출 금지
- [ ] SQL 직접 문자열 조합 금지 (Supabase 쿼리 빌더 사용)

### 7.2 필수 적용

- [ ] 모든 API 라우트에서 권한 확인
- [ ] Zod로 입력값 검증 (서버 측)
- [ ] RLS 정책 테스트 (권한 없는 접근 차단 확인)
- [ ] 파일 업로드 시 MIME 타입 검증

### 7.3 환경 변수

```bash
# .env.local (커밋 X)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # 서버에서만 사용
TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...       # 서버에서만 사용
NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.example (커밋 O)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# ... (값은 비워두기)
```

---

## 8. 테스트

### 8.1 테스트 도구

| 도구 | 용도 |
|------|------|
| Vitest | 단위 테스트 |
| React Testing Library | 컴포넌트 테스트 |
| Playwright | E2E 테스트 |

### 8.2 테스트 우선순위 (MVP)

1. 결제 플로우 (E2E)
2. RLS 권한 검증 (통합)
3. 유틸 함수 (단위)

### 8.3 테스트 명령어

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run e2e

# 테스트 커버리지
npm run test:coverage
```

---

## 9. Git 워크플로우

### 9.1 브랜치 전략

```
main                    # 프로덕션
├── develop             # 개발 통합
│   ├── feat/auth       # 인증 기능
│   ├── feat/products   # 상품 기능
│   ├── feat/cart       # 장바구니
│   ├── feat/checkout   # 결제
│   └── fix/bug-name    # 버그 수정
```

### 9.2 커밋 메시지

```
<type>(<scope>): <subject>

<body>
```

**타입:**
- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `docs`: 문서
- `test`: 테스트
- `chore`: 기타 (설정 등)

**예시:**
```
feat(products): 상품 상세 페이지 구현

- 상품 정보 표시
- 장바구니 담기 버튼
- PRD FEAT-1 구현 완료
```

### 9.3 병합 규칙

| 조건 | 필수 |
|------|------|
| 린트 통과 | O |
| 타입 체크 통과 | O |
| 테스트 통과 | O |
| 코드 리뷰 | 권장 |

---

## 10. AI 협업 팁

### 10.1 효과적인 프롬프트

**좋은 예:**
```
TASKS.md의 T1.1 "상품 목록 API" 태스크를 구현해주세요.

참조:
- 04-database-design.md의 products 테이블
- 02-trd.md의 API 응답 형식

요구사항:
- GET /api/products
- 페이지네이션 지원
- 에러 처리 포함
```

**나쁜 예:**
```
API 만들어줘
```

### 10.2 코드 수정 요청

```
components/products/product-card.tsx 파일의
handleAddToCart 함수를 수정해주세요.

현재 문제:
- 로딩 상태가 표시되지 않음

원하는 동작:
- 버튼 클릭 시 스피너 표시
- 완료 후 "담김!" 메시지로 변경
```

### 10.3 오류 해결 요청

```
## 에러
TypeError: Cannot read property 'id' of undefined

## 코드
const productId = product.id; // line 42

## 재현
1. /products 페이지 접근
2. 첫 번째 상품 클릭

## 시도한 것
- product가 undefined인지 확인 → 맞음
```

---

## Decision Log

- 라이브 코딩 친화적 코드: 주석 활용, 단계별 구현
- AI 커스터마이징 친화적: 모듈 분리, 명확한 타입
- Next.js App Router: 서버 컴포넌트 우선, 클라이언트 분리
- Supabase: RLS 중심 보안, 클라이언트 종류 구분
