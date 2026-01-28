# TASKS.md - Footer 페이지 구현

> Footer 메뉴의 모든 페이지 구현 및 관리자 편집 기능

---

## Phase 1: 정적 콘텐츠 페이지 (Static Pages)

### P1-T1.1: FAQ 페이지 구현
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/faq` 페이지 생성. 아코디언 형식의 FAQ 목록 표시. Neo-Brutalism 스타일.
- **파일**: `src/app/(shop)/faq/page.tsx`

### P1-T1.2: 환불 정책 페이지 구현
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/refund` 페이지 생성. 마크다운 기반 환불 정책 표시. Neo-Brutalism 스타일.
- **파일**: `src/app/(shop)/refund/page.tsx`

### P1-T1.3: 이용약관 페이지 구현
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/terms` 페이지 생성. 마크다운 기반 이용약관 표시. Neo-Brutalism 스타일.
- **파일**: `src/app/(shop)/terms/page.tsx`

### P1-T1.4: 개인정보처리방침 페이지 구현
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/privacy` 페이지 생성. 마크다운 기반 개인정보처리방침 표시. Neo-Brutalism 스타일.
- **파일**: `src/app/(shop)/privacy/page.tsx`

### P1-T1.5: 라이선스 페이지 구현
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/license` 페이지 생성. 디지털 상품 라이선스 정책 표시. Neo-Brutalism 스타일.
- **파일**: `src/app/(shop)/license/page.tsx`

---

## Phase 2: 동적 콘텐츠 페이지 (Dynamic Pages)

### P2-T2.1: 블로그 목록 페이지 구현
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/blog` 페이지 생성. 블로그 포스트 카드 그리드, 페이지네이션. Neo-Brutalism 스타일.
- **파일**: `src/app/(shop)/blog/page.tsx`

### P2-T2.2: 블로그 상세 페이지 구현
- **담당**: frontend-specialist
- **의존성**: P2-T2.1
- **설명**: `/blog/[slug]` 페이지 생성. 마크다운 렌더링, 목차, 공유 버튼.
- **파일**: `src/app/(shop)/blog/[slug]/page.tsx`

### P2-T2.3: 신규 상품 페이지 구현
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/new` 페이지 생성. 최근 30일 내 등록된 상품 목록. ProductCard 재사용.
- **파일**: `src/app/(shop)/new/page.tsx`

### P2-T2.4: 베스트 셀러 페이지 구현
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/best` 페이지 생성. 판매량 기준 상위 상품 목록. ProductCard 재사용.
- **파일**: `src/app/(shop)/best/page.tsx`

---

## Phase 3: 회사 정보 페이지 (Company Pages)

### P3-T3.1: 채용 페이지 구현
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/careers` 페이지 생성. 채용 공고 목록, 회사 문화 소개. Neo-Brutalism 스타일.
- **파일**: `src/app/(shop)/careers/page.tsx`

### P3-T3.2: 보도자료 페이지 구현
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/press` 페이지 생성. 보도자료 목록, 미디어 키트 다운로드. Neo-Brutalism 스타일.
- **파일**: `src/app/(shop)/press/page.tsx`

### P3-T3.3: 문의하기 리다이렉트
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/contact` → `/inquiries`로 리다이렉트. Next.js redirect 사용.
- **파일**: `src/app/(shop)/contact/page.tsx`

### P3-T3.4: 다운로드 센터 리다이렉트
- **담당**: frontend-specialist
- **의존성**: 없음
- **설명**: `/downloads` → `/my/downloads`로 리다이렉트. 비로그인 시 로그인 페이지로.
- **파일**: `src/app/(shop)/downloads/page.tsx`

---

## Phase 4: 데이터베이스 스키마 (DB Schema)

### P4-T4.1: 정적 페이지 콘텐츠 테이블 생성
- **담당**: database-specialist
- **의존성**: 없음
- **설명**: `static_pages` 테이블 생성. slug, title, content(markdown), updated_at.
- **파일**: `supabase/migrations/YYYYMMDD_static_pages.sql`

### P4-T4.2: 블로그 포스트 테이블 생성
- **담당**: database-specialist
- **의존성**: 없음
- **설명**: `blog_posts` 테이블 생성. slug, title, content, excerpt, thumbnail, author_id, published_at, status.
- **파일**: `supabase/migrations/YYYYMMDD_blog_posts.sql`

### P4-T4.3: FAQ 테이블 생성
- **담당**: database-specialist
- **의존성**: 없음
- **설명**: `faqs` 테이블 생성. question, answer, category, sort_order, is_active.
- **파일**: `supabase/migrations/YYYYMMDD_faqs.sql`

---

## Phase 5: 관리자 페이지 (Admin Pages)

### P5-T5.1: 정적 페이지 관리 API
- **담당**: backend-specialist
- **의존성**: P4-T4.1
- **설명**: `/api/admin/static-pages` CRUD API. 관리자 인증 필수.
- **파일**: `src/app/api/admin/static-pages/route.ts`, `src/app/api/admin/static-pages/[slug]/route.ts`

### P5-T5.2: 정적 페이지 관리 UI
- **담당**: frontend-specialist
- **의존성**: P5-T5.1
- **설명**: `/admin/pages` 관리 페이지. 목록, 편집, 마크다운 에디터. Neo-Brutalism 스타일.
- **파일**: `src/app/admin/pages/page.tsx`, `src/app/admin/pages/[slug]/edit/page.tsx`

### P5-T5.3: 블로그 포스트 관리 API
- **담당**: backend-specialist
- **의존성**: P4-T4.2
- **설명**: `/api/admin/blog` CRUD API. 관리자 인증 필수.
- **파일**: `src/app/api/admin/blog/route.ts`, `src/app/api/admin/blog/[id]/route.ts`

### P5-T5.4: 블로그 포스트 관리 UI
- **담당**: frontend-specialist
- **의존성**: P5-T5.3
- **설명**: `/admin/blog` 관리 페이지. 목록, 작성, 편집, 공개/비공개 토글. Neo-Brutalism 스타일.
- **파일**: `src/app/admin/blog/page.tsx`, `src/app/admin/blog/new/page.tsx`, `src/app/admin/blog/[id]/edit/page.tsx`

### P5-T5.5: FAQ 관리 API
- **담당**: backend-specialist
- **의존성**: P4-T4.3
- **설명**: `/api/admin/faqs` CRUD API. 관리자 인증 필수.
- **파일**: `src/app/api/admin/faqs/route.ts`, `src/app/api/admin/faqs/[id]/route.ts`

### P5-T5.6: FAQ 관리 UI
- **담당**: frontend-specialist
- **의존성**: P5-T5.5
- **설명**: `/admin/faqs` 관리 페이지. 목록, 추가, 편집, 순서 변경, 활성화 토글. Neo-Brutalism 스타일.
- **파일**: `src/app/admin/faqs/page.tsx`

---

## Phase 6: API 연동 및 마무리

### P6-T6.1: 정적 페이지 DB 연동
- **담당**: backend-specialist
- **의존성**: P4-T4.1, P1-T1.2, P1-T1.3, P1-T1.4, P1-T1.5
- **설명**: 정적 페이지들이 DB에서 콘텐츠를 가져오도록 수정.
- **파일**: `src/app/(shop)/refund/page.tsx`, `src/app/(shop)/terms/page.tsx`, `src/app/(shop)/privacy/page.tsx`, `src/app/(shop)/license/page.tsx`

### P6-T6.2: FAQ 페이지 DB 연동
- **담당**: backend-specialist
- **의존성**: P4-T4.3, P1-T1.1
- **설명**: FAQ 페이지가 DB에서 FAQ 목록을 가져오도록 수정.
- **파일**: `src/app/(shop)/faq/page.tsx`, `src/app/api/faqs/route.ts`

### P6-T6.3: 블로그 페이지 DB 연동
- **담당**: backend-specialist
- **의존성**: P4-T4.2, P2-T2.1, P2-T2.2
- **설명**: 블로그 페이지가 DB에서 포스트를 가져오도록 수정.
- **파일**: `src/app/(shop)/blog/page.tsx`, `src/app/(shop)/blog/[slug]/page.tsx`, `src/app/api/blog/route.ts`, `src/app/api/blog/[slug]/route.ts`

### P6-T6.4: Footer 링크 업데이트
- **담당**: frontend-specialist
- **의존성**: P1-T1.1, P1-T1.2, P1-T1.3, P1-T1.4, P1-T1.5, P2-T2.1, P2-T2.3, P2-T2.4, P3-T3.1, P3-T3.2, P3-T3.3, P3-T3.4
- **설명**: Footer 컴포넌트의 링크가 모두 올바르게 연결되어 있는지 확인.
- **파일**: `src/components/layout/footer.tsx`

### P6-T6.5: 관리자 사이드바 메뉴 추가
- **담당**: frontend-specialist
- **의존성**: P5-T5.2, P5-T5.4, P5-T5.6
- **설명**: 관리자 사이드바에 페이지 관리, 블로그 관리, FAQ 관리 메뉴 추가.
- **파일**: `src/components/admin/sidebar.tsx`

---

## 완료 기준

- [ ] 모든 Footer 링크가 404 없이 정상 작동
- [ ] 관리자 페이지에서 모든 콘텐츠 편집 가능
- [ ] Neo-Brutalism 디자인 일관성 유지
- [ ] 반응형 레이아웃 지원
