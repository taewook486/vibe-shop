# 진행 중인 작업 (Work in Progress)
**작성일**: 2026-01-31
**상태**: 진행 중

---

## 📋 작업 개요

사용자가 로그인하고 결제 완료 후 체크아웃 성공 페이지에 "회원가입하고 다운로드 관리하기"가 표시되는 문제와 inquiries 페이지 에러를 수정하는 작업입니다.

---

## ✅ 완료된 작업

### 1. 체크아웃 성공 페이지 인증 수정
**문제**: 로그인한 사용자가 결제 완료 후에도 "회원가입하고 다운로드 관리하기" 메시지가 표시됨

**원인**:
- 체크아웃 성공 페이지가 Supabase Auth (`supabase.auth.getUser()`)를 사용하여 인증 확인
- 앱은 NextAuth.js를 사용 중이므로 인증 정보가 일치하지 않음

**수정 내용**:
- **파일**: `src/app/(shop)/checkout/success/checkout-success-content.tsx`
- **변경사항**:
  ```typescript
  // Before (Supabase Auth)
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  setIsAuthenticated(!!user);

  // After (NextAuth)
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  ```

**상태**: ✅ 완료, 커밋됨 (`5e3c9ee`), Vercel 배포 완료

---

### 2. Inquiries 페이지 스키마 불일치 수정 (마이그레이션 파일 생성)
**문제**: https://vibe-shop-swart.vercel.app/inquiries 페이지에서 에러 발생

**원인**: 데이터베이스 제약조건과 앱 코드의 Zod 스키마 불일치
- **DB 마이그레이션** (`009_create_inquiries.sql:30`):
  ```sql
  category IN ('product', 'shipping', 'payment', 'etc')
  ```
- **Zod 스키마** (`src/types/inquiry.ts:38`):
  ```typescript
  z.enum(['product', 'shipping', 'refund', 'etc'])
  ```
- **불일치**: DB는 'payment' 허용, 코드는 'refund' 요구

**해결 방안**:
- **마이그레이션 파일 생성**: `supabase/migrations/015_fix_inquiries_category_constraint.sql`
- **내용**:
  1. 기존 제약조건 삭제
  2. 새 제약조건 추가 (`'payment'` → `'refund'`)
  3. 기존 'payment' 카테고리 데이터를 'refund'로 변환

**상태**: 🔄 마이그레이션 파일 생성 완료, **DB 적용 필요**

---

## 🔄 진행 중인 작업

### Inquiries 페이지 DB 마이그레이션 적용

**다음 단계**:

1. **Supabase 대시보드에서 SQL 실행**:
   - URL: https://supabase.com/dashboard/project/rwuvldzhpfnlrnyykyxl/sql/new
   - 실행할 SQL: `supabase/migrations/015_fix_inquiries_category_constraint.sql` 내용

2. **검증**:
   - https://vibe-shop-swart.vercel.app/inquiries 접속
   - 페이지가 정상적으로 로드되는지 확인
   - 카테고리 필터 작동 확인

---

## 📝 마이그레이션 SQL (복사용)

```sql
-- =====================================================
-- Migration: 015_fix_inquiries_category_constraint.sql
-- Description: Fix inquiries category constraint to match app schema
-- Author: claude
-- Date: 2026-01-30
-- =====================================================

-- Drop the old category constraint
ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_category_check;

-- Add the corrected constraint matching the application schema
ALTER TABLE inquiries ADD CONSTRAINT inquiries_category_check
  CHECK (category IN ('product', 'shipping', 'refund', 'etc'));

-- Update any existing records with 'payment' category to 'refund'
UPDATE inquiries
SET category = 'refund'
WHERE category = 'payment';

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ inquiries category constraint fixed';
  RAISE NOTICE '   Changed allowed values from: product, shipping, payment, etc';
  RAISE NOTICE '   To: product, shipping, refund, etc';
  RAISE NOTICE '   Existing records with payment category updated to refund';
END $$;
```

---

## 🔍 관련 파일

### 수정된 파일
1. `src/app/(shop)/checkout/success/checkout-success-content.tsx` - NextAuth 인증으로 변경
2. `supabase/migrations/015_fix_inquiries_category_constraint.sql` - Inquiries 카테고리 제약조건 수정

### 참조 파일
1. `src/app/api/inquiries/route.ts` - Inquiries API 엔드포인트
2. `src/types/inquiry.ts` - Inquiries 타입 정의 (Zod 스키마)
3. `supabase/migrations/009_create_inquiries.sql` - 기존 Inquiries 테이블 생성 마이그레이션

---

## ✅ 체크리스트

- [x] 체크아웃 성공 페이지 인증 수정 (Supabase → NextAuth)
- [x] Inquiries 스키마 불일치 분석
- [x] 마이그레이션 SQL 파일 생성
- [ ] **Supabase DB에 마이그레이션 적용** ← 내일 첫 작업
- [ ] Inquiries 페이지 동작 테스트
- [ ] 체크아웃 성공 페이지 동작 테스트 (프로덕션)

---

## 🚀 내일 작업 순서

1. **Supabase 마이그레이션 적용**
   - Supabase 대시보드 접속
   - SQL Editor에서 위 마이그레이션 실행

2. **테스트**
   - Inquiries 페이지: https://vibe-shop-swart.vercel.app/inquiries
   - 체크아웃 성공 페이지 테스트 (로그인 → 결제 → 성공 페이지)

3. **문서 정리**
   - 작업 완료 후 이 파일 삭제 또는 보관소로 이동

---

## 📞 참고 정보

- **프로덕션 URL**: https://vibe-shop-swart.vercel.app
- **Supabase Project**: https://supabase.com/dashboard/project/rwuvldzhpfnlrnyykyxl
- **GitHub Repo**: https://github.com/taewook486/vibe-shop
- **마지막 커밋**: `5e3c9ee` (fix: Use NextAuth for checkout success page and fix inquiries schema)

---

**작업 재개 시**: 이 파일을 먼저 읽고 `Supabase 마이그레이션 적용`부터 진행하세요!
