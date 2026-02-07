# Task P6-T6.3: Inquiries API Implementation Report

**Task ID**: P6-T6.3
**Phase**: 6 (Community Features)
**担当**: backend-specialist
**Status**: ✅ COMPLETED
**Date**: 2026-01-25

---

## 📋 Summary

Implemented complete Inquiries API endpoints with the following features:
- ✅ GET /api/inquiries - 문의 목록 조회 (비밀글 필터링)
- ✅ POST /api/inquiries - 문의 작성
- ✅ GET /api/inquiries/[id] - 문의 상세 조회
- ✅ PATCH /api/inquiries/[id] - 문의 수정 (작성자만, 답변 전)
- ✅ DELETE /api/inquiries/[id] - 문의 삭제 (작성자만, 답변 전)
- ✅ POST /api/inquiries/[id]/answer - 관리자 답변

---

## 📂 Files Created

### API Routes
1. **`src/app/api/inquiries/route.ts`** (268 lines)
   - GET: 문의 목록 조회 (페이지네이션, 필터링, 정렬)
   - POST: 문의 작성 (인증 필수)
   - Features:
     - 비밀글 RLS 정책 자동 적용
     - 카테고리/상태/검색 필터
     - 정렬 옵션 (latest/oldest/unanswered/most_viewed)
     - 작성자/상품 정보 포함

2. **`src/app/api/inquiries/[id]/route.ts`** (263 lines)
   - GET: 문의 상세 조회 (조회수 자동 증가)
   - PATCH: 문의 수정 (RLS: 본인 & pending만)
   - DELETE: 문의 삭제 (RLS: 본인 & pending만)
   - Features:
     - 작성자, 상품, 답변자 정보 포함
     - `increment_inquiry_view_count()` 함수 호출
     - RLS 정책으로 권한 제어

3. **`src/app/api/inquiries/[id]/answer/route.ts`** (143 lines)
   - POST: 관리자 답변
   - Features:
     - 관리자 권한 확인 (role='admin')
     - 트리거에 의해 status='answered', answered_at 자동 설정
     - 답변자 정보 포함

### Tests
4. **`tests/api/inquiries.test.ts`** (391 lines)
   - TDD 스타일 통합 테스트 (Supabase 직접 연동)
   - Coverage: 모든 API 엔드포인트 + RLS 정책

5. **`tests/api/inquiries.simple.test.ts`** (168 lines)
   - 간단한 API 테스트 (fetch 기반)
   - Coverage: 기본 응답 구조, 인증 확인, 유효성 검사

### Type Updates
6. **`src/types/database.types.ts`** (업데이트)
   - Added Functions:
     - `increment_inquiry_view_count(inquiry_id: string): void`
     - `get_pending_inquiry_count(): number`
     - `get_product_inquiry_count(p_product_id: string): number`

---

## ✅ Acceptance Criteria

### 1. GET /api/inquiries - 문의 목록 조회
- [x] 페이지네이션 (page, limit)
- [x] 필터링 (product_id, category, status, search)
- [x] 정렬 (latest, oldest, unanswered, most_viewed)
- [x] 비밀글은 RLS 정책으로 작성자/관리자만 조회
- [x] 작성자 및 상품 정보 포함

### 2. POST /api/inquiries - 문의 작성
- [x] 로그인 필수 (auth.uid())
- [x] 필수 필드 검증 (product_id, category, title, content)
- [x] 카테고리 검증 (product/shipping/payment/etc)
- [x] 비밀글 옵션 (is_private)
- [x] status='pending' 자동 설정

### 3. GET /api/inquiries/[id] - 문의 상세 조회
- [x] 비밀글 접근 제어 (RLS)
- [x] 조회수 자동 증가 (`increment_inquiry_view_count`)
- [x] 작성자, 상품, 답변자 정보 포함

### 4. PATCH /api/inquiries/[id] - 문의 수정
- [x] 작성자만 수정 가능 (RLS)
- [x] 답변 전에만 수정 가능 (RLS: status='pending')
- [x] 필드별 부분 업데이트 (Zod schema)

### 5. DELETE /api/inquiries/[id] - 문의 삭제
- [x] 작성자만 삭제 가능 (RLS)
- [x] 답변 전에만 삭제 가능 (RLS: status='pending')

### 6. POST /api/inquiries/[id]/answer - 관리자 답변
- [x] 관리자만 가능 (role='admin' 확인)
- [x] 답변 작성 시 트리거에 의해 status='answered' 자동 변경
- [x] answered_by, answered_at 자동 설정
- [x] 기존 답변 수정 가능

---

## 🔒 Security Features

### RLS Policies (from migration 009_create_inquiries.sql)
1. **Public Inquiries Viewable by All**
   - 공개 문의는 누구나 조회
   - 비밀글은 작성자 또는 관리자만 조회

2. **Authenticated Insert**
   - 로그인 사용자만 문의 작성
   - user_id 자동 검증 (`auth.uid() = user_id`)

3. **Owner Update (Pending Only)**
   - 작성자만 수정
   - status='pending'일 때만 수정 가능

4. **Owner Delete (Pending Only)**
   - 작성자만 삭제
   - status='pending'일 때만 삭제 가능

5. **Admin All Access**
   - 관리자는 모든 문의 관리 및 답변

### Authentication Checks
- All mutating endpoints check `auth.getUser()`
- Answer endpoint verifies `role='admin'` from profiles table
- Proper 401/403 error responses

---

## 🔧 Database Integration

### Functions Used
1. **`increment_inquiry_view_count(inquiry_id UUID)`**
   - 조회수 자동 증가
   - SECURITY DEFINER로 RLS 우회

2. **`get_pending_inquiry_count()`** (준비됨)
   - 미답변 문의 개수 조회 (관리자 대시보드용)

3. **`get_product_inquiry_count(p_product_id UUID)`** (준비됨)
   - 상품별 공개 문의 개수

### Triggers
1. **`on_inquiry_answered`**
   - answer 작성 시 자동으로 status='answered', answered_at=NOW() 설정
   - 구현됨 (migration에서)

2. **`set_inquiries_updated_at`**
   - updated_at 자동 갱신

---

## 📊 API Response Examples

### GET /api/inquiries
```json
{
  "inquiries": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "user_id": "uuid",
      "category": "product",
      "title": "배송 기간 문의",
      "content": "...",
      "is_private": false,
      "status": "pending",
      "answer": null,
      "answered_by": null,
      "answered_at": null,
      "view_count": 5,
      "created_at": "2026-01-25T10:00:00Z",
      "updated_at": "2026-01-25T10:00:00Z",
      "author": {
        "id": "uuid",
        "email": "user@example.com",
        "nickname": "User",
        "avatar_url": null
      },
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "slug": "product-slug",
        "thumbnail_url": "https://..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### POST /api/inquiries
```json
{
  "inquiry": {
    "id": "uuid",
    "product_id": "uuid",
    "user_id": "uuid",
    "category": "product",
    "title": "배송 기간 문의",
    "content": "급하게 필요한데 배송 기간이 궁금합니다.",
    "is_private": false,
    "status": "pending",
    "answer": null,
    "view_count": 0,
    "created_at": "2026-01-25T10:00:00Z",
    "updated_at": "2026-01-25T10:00:00Z",
    "author": { /* ... */ },
    "product": { /* ... */ }
  }
}
```

### POST /api/inquiries/[id]/answer
```json
{
  "inquiry": {
    "id": "uuid",
    "answer": "배송 기간은 결제 후 2-3일 소요됩니다.",
    "status": "answered",
    "answered_by": "admin-uuid",
    "answered_at": "2026-01-25T11:00:00Z",
    "answerer": {
      "id": "admin-uuid",
      "email": "admin@example.com",
      "nickname": "Admin",
      "avatar_url": null
    },
    /* ... */
  }
}
```

---

## 🧪 Testing

### Test Coverage
1. **Unit Tests** (`tests/api/inquiries.test.ts`)
   - All CRUD operations
   - RLS policy enforcement
   - Authentication checks
   - Validation errors

2. **Integration Tests** (`tests/api/inquiries.simple.test.ts`)
   - API endpoint responses
   - HTTP status codes
   - Response structure

### Manual Testing Checklist
- [ ] 비회원: 공개 문의 목록 조회 가능
- [ ] 비회원: 비밀글은 목록에서 제외됨
- [ ] 로그인: 문의 작성 가능
- [ ] 로그인: 비밀글 작성 가능
- [ ] 작성자: 자신의 문의 수정 가능 (답변 전)
- [ ] 작성자: 자신의 문의 삭제 가능 (답변 전)
- [ ] 타인: 다른 사람 문의 수정/삭제 불가
- [ ] 관리자: 모든 문의 조회 가능 (비밀글 포함)
- [ ] 관리자: 답변 작성 가능
- [ ] 답변 후: status='answered' 자동 변경
- [ ] 답변 후: 작성자는 수정/삭제 불가

---

## 🚀 Performance Considerations

### Indexes (from migration)
1. `idx_inquiries_product_id` - 상품별 문의 조회
2. `idx_inquiries_user_id` - 사용자별 문의 조회
3. `idx_inquiries_status` - 상태별 필터링 (관리자)
4. `idx_inquiries_category` - 카테고리별 필터링
5. `idx_inquiries_created_at` - 최신순 정렬
6. `idx_inquiries_is_private` - 비밀글 필터링
7. `idx_inquiries_answered_by` - 답변자별 조회 (통계)

### Query Optimization
- Single query with joins for related data
- Count query for pagination
- Range-based pagination

---

## 📝 Next Steps

### Frontend Integration (T6.8)
- [ ] 문의 게시판 페이지 구현
- [ ] 문의 작성 폼 컴포넌트
- [ ] 문의 상세 페이지
- [ ] 관리자 답변 UI (T6.10)

### Additional Features (Optional)
- [ ] 이메일 알림 (답변 시)
- [ ] 답변 템플릿 기능
- [ ] 문의 통계 (관리자 대시보드)
- [ ] 파일 첨부 기능

---

## 🐛 Known Issues

None at this time.

---

## 🎯 Conclusion

Successfully implemented all Inquiries API endpoints with:
- ✅ Complete CRUD operations
- ✅ RLS-based security
- ✅ Admin answer functionality
- ✅ Type-safe implementation
- ✅ Comprehensive test coverage
- ✅ Proper error handling
- ✅ Database trigger integration

**Status**: Ready for frontend integration (T6.8)

---

**Completed by**: backend-specialist (Claude Code)
**Date**: 2026-01-25
**Worktree**: `worktree/phase-6-community`
