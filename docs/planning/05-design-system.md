# Design System (Neo-Brutalism)

> Vibe Store의 시각적 아이덴티티 - 대담하고 생생한 네오브루탈리즘 디자인

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

## 1. 디자인 철학

### 1.1 네오브루탈리즘 원칙

| 원칙 | 설명 | 구현 방법 |
|------|------|----------|
| **Bold & Loud** | 대담하고 눈에 띄는 디자인 | 굵은 테두리, 하드 섀도우 |
| **Raw & Honest** | 꾸밈없는 솔직한 표현 | 플랫 컬러, 그라데이션 없음 |
| **Playful** | 즐겁고 활기찬 느낌 | 비비드 컬러, 불규칙 요소 |
| **Functional** | 기능성과 명확성 우선 | 큰 클릭 영역, 명확한 상태 |

### 1.2 핵심 스타일 요소

```
┌─────────────────────────────────────────────┐
│  Neo-Brutalism = Bold Borders + Hard Shadow │
│                                             │
│   ┌──────────────────┐                      │
│   │                  │░░                    │
│   │   BUTTON         │░░  ← 4px offset      │
│   │                  │░░    shadow          │
│   └──────────────────┘░░                    │
│     ░░░░░░░░░░░░░░░░░░░░                    │
│           ↑                                 │
│     2-3px black border                      │
└─────────────────────────────────────────────┘
```

### 1.3 참고 서비스 (무드보드)

| 서비스 | 참고할 점 | 참고하지 않을 점 |
|--------|----------|-----------------|
| Gumroad Neo | 굵은 테두리, 하드 섀도우 | - |
| Figma Community | 생생한 컬러 조합 | 과한 장식 |
| Notion Calendar | 깔끔한 브루탈 카드 | - |
| Linear | 기능적 미니멀리즘 | 너무 차분한 톤 |

### 1.4 브랜드 키워드

```
바이브랩스 = "함께 만드는 즐거움"

- BOLD (대담한)
- VIBRANT (생생한)
- PLAYFUL (즐거운)
- HONEST (솔직한)
```

---

## 2. 컬러 팔레트

### 2.1 Primary 컬러 (Neo-Brutalism)

| 역할 | 컬러명 | Hex | 사용처 | 미리보기 |
|------|--------|-----|--------|----------|
| **Primary** | Electric Blue | `#0066FF` | 주요 버튼, 링크 | 🟦 |
| **Secondary** | Hot Pink | `#FF3366` | 강조, 배지, CTA | 🩷 |
| **Accent 1** | Lime | `#CCFF00` | 하이라이트, 성공 | 🟩 |
| **Accent 2** | Sunny Yellow | `#FFE600` | 주목, 특별 강조 | 🟨 |
| **Accent 3** | Electric Purple | `#9933FF` | 프리미엄, VIP | 🟪 |

### 2.2 베이스 컬러

| 역할 | 컬러명 | Hex | 사용처 |
|------|--------|-----|--------|
| **Background** | Off-White | `#FFFDF7` | 전체 배경 (순백색 X) |
| **Surface** | Cream | `#FFF8E7` | 카드 배경 |
| **Border** | Ink Black | `#1A1A1A` | 테두리 (굵게) |
| **Shadow** | Pure Black | `#000000` | 하드 섀도우 |
| **Text Primary** | Ink Black | `#1A1A1A` | 주요 텍스트 |
| **Text Secondary** | Dark Gray | `#4A4A4A` | 보조 텍스트 |

### 2.3 피드백 컬러

| 상태 | 컬러명 | Hex | 배경 | 사용처 |
|------|--------|-----|------|--------|
| **Success** | Lime | `#CCFF00` | `#F0FFB3` | 성공, 완료 |
| **Warning** | Sunny Yellow | `#FFE600` | `#FFF9CC` | 주의, 경고 |
| **Error** | Hot Red | `#FF3333` | `#FFE6E6` | 오류, 삭제 |
| **Info** | Electric Blue | `#0066FF` | `#E6F0FF` | 정보, 도움말 |

### 2.4 Tailwind CSS 커스텀 설정

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Neo-Brutalism Primary
        'neo-blue': '#0066FF',
        'neo-pink': '#FF3366',
        'neo-lime': '#CCFF00',
        'neo-yellow': '#FFE600',
        'neo-purple': '#9933FF',

        // Base
        'neo-white': '#FFFDF7',
        'neo-cream': '#FFF8E7',
        'neo-black': '#1A1A1A',
      },

      // Hard Shadow (offset shadow)
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #1A1A1A',
        'neo': '4px 4px 0px 0px #1A1A1A',
        'neo-lg': '6px 6px 0px 0px #1A1A1A',
        'neo-xl': '8px 8px 0px 0px #1A1A1A',

        // Colored shadows
        'neo-blue': '4px 4px 0px 0px #0066FF',
        'neo-pink': '4px 4px 0px 0px #FF3366',
        'neo-lime': '4px 4px 0px 0px #CCFF00',
      },

      // Bold borders
      borderWidth: {
        '3': '3px',
      },
    },
  },
}
```

### 2.5 다크 모드 (v2)

```javascript
// 다크 모드 컬러 (v2 예정)
const darkColors = {
  background: '#1A1A1A',
  surface: '#2A2A2A',
  border: '#FFFDF7',
  shadow: '#FFFDF7',  // 밝은 섀도우로 반전

  // 네온 효과 추가
  'neo-blue': '#00CCFF',
  'neo-pink': '#FF66CC',
  'neo-lime': '#66FF00',
}
```

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

| 용도 | 폰트 | 대안 | 특징 |
|------|------|------|------|
| 제목 | **Space Grotesk** | Arial Black, sans-serif | 기하학적, 대담함 |
| 본문 | **Inter** | system-ui, sans-serif | 가독성, 현대적 |
| 코드/숫자 | **JetBrains Mono** | Consolas, monospace | 개발자 친화적 |
| 한글 | **Pretendard** | Apple SD Gothic Neo | 한글 최적화 |

### 3.2 타입 스케일

| 이름 | 크기 | 행간 | 굵기 | Tailwind | 용도 |
|------|------|------|------|----------|------|
| **Display** | 64px | 1.0 | 800 (Black) | `text-6xl font-black` | 히어로 타이틀 |
| **H1** | 48px | 1.1 | 700 (Bold) | `text-5xl font-bold` | 페이지 타이틀 |
| **H2** | 36px | 1.2 | 700 (Bold) | `text-4xl font-bold` | 섹션 타이틀 |
| **H3** | 28px | 1.2 | 600 (SemiBold) | `text-3xl font-semibold` | 카드 타이틀 |
| **H4** | 22px | 1.3 | 600 (SemiBold) | `text-xl font-semibold` | 서브 타이틀 |
| **Body Large** | 18px | 1.6 | 500 (Medium) | `text-lg font-medium` | 강조 본문 |
| **Body** | 16px | 1.6 | 400 (Regular) | `text-base` | 기본 본문 |
| **Body Small** | 14px | 1.5 | 400 (Regular) | `text-sm` | 캡션 |
| **Caption** | 12px | 1.4 | 500 (Medium) | `text-xs font-medium` | 라벨, 배지 |

### 3.3 텍스트 스타일 특징

```jsx
// Neo-Brutalism 텍스트: 대문자 + 굵은 폰트 활용
<h1 className="text-5xl font-black uppercase tracking-tight">
  VIBE STORE
</h1>

// 가격 표시 - 대담하게
<div className="flex items-baseline gap-3">
  <span className="text-4xl font-black text-neo-blue">
    ₩19,900
  </span>
  <span className="text-xl text-neo-black/50 line-through">
    ₩29,900
  </span>
  <span className="px-2 py-1 bg-neo-lime text-neo-black text-sm font-bold border-2 border-neo-black">
    -33%
  </span>
</div>
```

---

## 4. 간격 토큰 (Spacing)

| 이름 | 값 | Tailwind | 용도 |
|------|-----|----------|------|
| **3xs** | 2px | `0.5` | 미세 조정 |
| **2xs** | 4px | `1` | 배지 패딩 |
| **xs** | 8px | `2` | 아이콘 간격 |
| **sm** | 12px | `3` | 인라인 요소 |
| **md** | 16px | `4` | 기본 패딩 |
| **lg** | 24px | `6` | 카드 내부 |
| **xl** | 32px | `8` | 섹션 내부 |
| **2xl** | 48px | `12` | 섹션 간격 |
| **3xl** | 64px | `16` | 페이지 여백 |
| **4xl** | 96px | `24` | 히어로 섹션 |

---

## 5. 기본 컴포넌트

### 5.1 버튼 (Button)

#### 스타일 변형

| 변형 | 스타일 | 용도 |
|------|--------|------|
| **Primary** | 파란 배경 + 검은 테두리 + 검은 섀도우 | 주요 액션 |
| **Secondary** | 핑크 배경 + 검은 테두리 + 검은 섀도우 | 보조 액션 |
| **Outline** | 투명 배경 + 검은 테두리 + 검은 섀도우 | 세컨더리 |
| **Ghost** | 투명 배경 + 테두리 없음 | 텍스트 링크 |
| **Destructive** | 빨간 배경 + 검은 테두리 + 검은 섀도우 | 삭제, 취소 |

#### 코드 예시

```jsx
// Primary Button - Neo-Brutalism
<button className="
  px-6 py-3
  bg-neo-blue text-white
  border-3 border-neo-black
  shadow-neo
  font-bold uppercase tracking-wide

  hover:translate-x-[2px] hover:translate-y-[2px]
  hover:shadow-neo-sm

  active:translate-x-[4px] active:translate-y-[4px]
  active:shadow-none

  transition-all duration-150
">
  장바구니 담기
</button>

// Secondary Button
<button className="
  px-6 py-3
  bg-neo-pink text-white
  border-3 border-neo-black
  shadow-neo
  font-bold uppercase

  hover:translate-x-[2px] hover:translate-y-[2px]
  hover:shadow-neo-sm

  transition-all duration-150
">
  지금 구매
</button>

// Outline Button
<button className="
  px-6 py-3
  bg-neo-white text-neo-black
  border-3 border-neo-black
  shadow-neo
  font-bold

  hover:bg-neo-yellow
  hover:translate-x-[2px] hover:translate-y-[2px]
  hover:shadow-neo-sm

  transition-all duration-150
">
  더 보기
</button>
```

#### 버튼 크기

| 크기 | 높이 | 패딩 | 폰트 | Tailwind |
|------|------|------|------|----------|
| **xl** | 56px | px-8 py-4 | text-lg | 히어로 CTA |
| **lg** | 48px | px-6 py-3 | text-base | 주요 버튼 |
| **md** | 40px | px-5 py-2.5 | text-sm | 기본 버튼 |
| **sm** | 32px | px-4 py-2 | text-xs | 작은 버튼 |

#### 버튼 상태

```jsx
// Hover: 살짝 눌림 효과 (섀도우 감소)
hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm

// Active: 완전히 눌림 (섀도우 제거)
active:translate-x-[4px] active:translate-y-[4px] active:shadow-none

// Disabled: 흐리게 + 커서 변경
disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0

// Loading: 스피너 + 텍스트
<button disabled className="...">
  <Loader2 className="w-5 h-5 animate-spin mr-2" />
  처리 중...
</button>
```

### 5.2 입력 필드 (Input)

```jsx
// 기본 Input
<input
  className="
    w-full px-4 py-3
    bg-neo-white
    border-3 border-neo-black
    shadow-neo-sm

    text-neo-black placeholder:text-neo-black/40
    font-medium

    focus:outline-none
    focus:shadow-neo
    focus:border-neo-blue

    transition-all duration-150
  "
  placeholder="이메일 주소"
/>

// 에러 상태
<div>
  <input className="
    ...
    border-[#FF3333]
    shadow-[2px_2px_0px_0px_#FF3333]
  " />
  <p className="mt-2 text-sm font-medium text-[#FF3333]">
    유효한 이메일을 입력해주세요
  </p>
</div>

// 라벨 + Input 조합
<div className="space-y-2">
  <label className="text-sm font-bold uppercase tracking-wide text-neo-black">
    이메일 *
  </label>
  <input className="..." placeholder="you@example.com" />
</div>
```

### 5.3 카드 (Card)

```jsx
// 상품 카드 - Neo-Brutalism
<div className="
  group
  bg-neo-white
  border-3 border-neo-black
  shadow-neo
  overflow-hidden

  hover:translate-x-[-2px] hover:translate-y-[-2px]
  hover:shadow-neo-lg

  transition-all duration-200
">
  {/* 썸네일 */}
  <div className="aspect-[4/3] bg-neo-cream border-b-3 border-neo-black overflow-hidden">
    <img
      src="..."
      alt="..."
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>

  {/* 태그 */}
  <div className="px-4 pt-4 flex gap-2">
    <span className="px-2 py-1 bg-neo-lime text-neo-black text-xs font-bold border-2 border-neo-black">
      TEMPLATE
    </span>
    <span className="px-2 py-1 bg-neo-cream text-neo-black text-xs font-bold border-2 border-neo-black">
      NEXT.JS
    </span>
  </div>

  {/* 콘텐츠 */}
  <div className="p-4">
    <h3 className="text-xl font-bold text-neo-black line-clamp-2">
      Next.js 대시보드 템플릿
    </h3>
    <p className="mt-2 text-sm text-neo-black/70 line-clamp-2">
      관리자 대시보드를 위한 완벽한 스타터 템플릿
    </p>

    {/* 가격 */}
    <div className="mt-4 flex items-center justify-between">
      <span className="text-2xl font-black text-neo-blue">
        ₩29,900
      </span>
      <button className="
        px-4 py-2
        bg-neo-pink text-white
        border-2 border-neo-black
        shadow-neo-sm
        text-sm font-bold

        hover:translate-x-[1px] hover:translate-y-[1px]
        hover:shadow-[1px_1px_0px_0px_#1A1A1A]

        transition-all duration-150
      ">
        담기
      </button>
    </div>
  </div>
</div>
```

### 5.4 배지 (Badge)

```jsx
// 태그 배지
<span className="
  inline-flex items-center
  px-3 py-1
  bg-neo-lime text-neo-black
  border-2 border-neo-black
  text-xs font-bold uppercase
">
  NEW
</span>

// 상태 배지
<span className="... bg-neo-lime border-neo-black">완료</span>
<span className="... bg-neo-yellow border-neo-black">처리중</span>
<span className="... bg-[#FF3333] text-white border-neo-black">취소</span>
<span className="... bg-neo-blue text-white border-neo-black">진행중</span>

// 할인 배지
<span className="
  px-2 py-1
  bg-neo-pink text-white
  border-2 border-neo-black
  text-sm font-black
  rotate-[-3deg]
">
  -30%
</span>

// 카운트 배지 (장바구니 등)
<span className="
  absolute -top-2 -right-2
  w-6 h-6
  flex items-center justify-center
  bg-neo-pink text-white
  border-2 border-neo-black
  text-xs font-bold
  rounded-full
">
  3
</span>
```

### 5.5 알럿 (Alert)

```jsx
// Success Alert
<div className="
  p-4
  bg-[#F0FFB3]
  border-3 border-neo-black
  shadow-neo-sm
  flex items-start gap-3
">
  <CheckCircle className="w-6 h-6 text-neo-black flex-shrink-0" />
  <div>
    <p className="font-bold text-neo-black">결제가 완료되었습니다!</p>
    <p className="text-sm text-neo-black/70">다운로드 센터에서 파일을 받으세요.</p>
  </div>
</div>

// Error Alert
<div className="
  p-4
  bg-[#FFE6E6]
  border-3 border-[#FF3333]
  shadow-[4px_4px_0px_0px_#FF3333]
  flex items-start gap-3
">
  <XCircle className="w-6 h-6 text-[#FF3333] flex-shrink-0" />
  <div>
    <p className="font-bold text-neo-black">결제에 실패했습니다</p>
    <p className="text-sm text-neo-black/70">카드 정보를 확인해주세요.</p>
  </div>
</div>

// Warning Alert
<div className="
  p-4
  bg-[#FFF9CC]
  border-3 border-neo-black
  shadow-neo-sm
">
  <p className="font-bold text-neo-black">⚠️ 다운로드 횟수가 1회 남았습니다</p>
</div>
```

### 5.6 모달 (Modal)

```jsx
// Modal Overlay
<div className="fixed inset-0 bg-neo-black/50 flex items-center justify-center p-4">

  {/* Modal Content */}
  <div className="
    w-full max-w-md
    bg-neo-white
    border-3 border-neo-black
    shadow-neo-xl
  ">
    {/* Header */}
    <div className="
      px-6 py-4
      border-b-3 border-neo-black
      flex items-center justify-between
    ">
      <h2 className="text-xl font-bold">로그인</h2>
      <button className="p-1 hover:bg-neo-cream transition-colors">
        <X className="w-6 h-6" />
      </button>
    </div>

    {/* Body */}
    <div className="p-6">
      {/* 콘텐츠 */}
    </div>

    {/* Footer */}
    <div className="
      px-6 py-4
      border-t-3 border-neo-black
      bg-neo-cream
      flex justify-end gap-3
    ">
      <button className="neo-button-outline">취소</button>
      <button className="neo-button-primary">확인</button>
    </div>
  </div>
</div>
```

---

## 6. 레이아웃

### 6.1 그리드 시스템

```jsx
// 상품 목록 그리드 - 카드 간격 넉넉하게
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>

// 2단 레이아웃 (사이드바 + 콘텐츠)
<div className="flex gap-8">
  <aside className="w-64 shrink-0">
    {/* 필터 사이드바 */}
  </aside>
  <main className="flex-1">
    {/* 메인 콘텐츠 */}
  </main>
</div>
```

### 6.2 컨테이너

```jsx
// 최대 너비 + 중앙 정렬
<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
  {/* 콘텐츠 - 네오브루탈리즘은 여백이 넉넉해야 함 */}
</div>

// 전체 너비 섹션
<section className="w-full bg-neo-yellow border-y-3 border-neo-black">
  <div className="max-w-7xl mx-auto px-6 py-16">
    {/* 강조 배너 */}
  </div>
</section>
```

### 6.3 반응형 브레이크포인트

| 이름 | 너비 | Tailwind | 그리드 컬럼 |
|------|------|----------|-------------|
| **sm** | 640px | `sm:` | 2 columns |
| **md** | 768px | `md:` | 2 columns |
| **lg** | 1024px | `lg:` | 3 columns |
| **xl** | 1280px | `xl:` | 4 columns |
| **2xl** | 1536px | `2xl:` | 4 columns |

---

## 7. 접근성 체크리스트

### 7.1 필수 (MVP)

- [x] **색상 대비**: 네오브루탈리즘의 높은 대비로 자연 충족 (검정/흰색 기반)
- [x] **포커스 링**: 굵은 테두리로 명확한 포커스 표시
- [x] **클릭 영역**: 큰 버튼, 넉넉한 패딩 (최소 44px)
- [x] **에러 표시**: 색상 + 굵은 텍스트 + 아이콘 병행
- [x] **폰트 크기**: 본문 최소 16px

### 7.2 포커스 스타일

```jsx
// Neo-Brutalism 포커스 - 오프셋 아웃라인
focus:outline-none
focus:ring-4 focus:ring-neo-blue
focus:ring-offset-2 focus:ring-offset-neo-white

// 또는 테두리 색상 변경
focus:border-neo-blue focus:shadow-neo-blue
```

### 7.3 권장 (v2)

- [ ] 키보드 전체 탐색 (Tab, Enter, Escape)
- [ ] 스크린 리더 호환 (ARIA 라벨)
- [ ] 애니메이션 줄이기 옵션 (`prefers-reduced-motion`)
- [ ] 고대비 모드 (이미 높은 대비지만 추가 옵션)

---

## 8. 아이콘 & 일러스트

### 8.1 아이콘 라이브러리

| 선택 | Lucide React |
|------|-------------|
| 이유 | 깔끔한 라인 아이콘, 커스터마이징 용이 |
| 스타일 | stroke-width: 2.5 (더 굵게) |
| 설치 | `npm install lucide-react` |

### 8.2 아이콘 사용 규칙

```jsx
import { ShoppingCart, Download, Check } from 'lucide-react';

// Neo-Brutalism 아이콘 - 더 굵은 선
<ShoppingCart className="w-6 h-6" strokeWidth={2.5} />

// 버튼 내 아이콘
<button className="neo-button flex items-center gap-2">
  <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
  <span>장바구니 담기</span>
</button>

// 아이콘 버튼 (정사각형)
<button className="
  w-12 h-12
  flex items-center justify-center
  bg-neo-white
  border-3 border-neo-black
  shadow-neo-sm

  hover:bg-neo-yellow
  hover:translate-x-[1px] hover:translate-y-[1px]
  hover:shadow-[1px_1px_0px_0px_#1A1A1A]

  transition-all duration-150
">
  <Heart className="w-6 h-6" strokeWidth={2.5} />
</button>
```

### 8.3 자주 사용할 아이콘

| 용도 | Lucide 이름 | strokeWidth |
|------|-------------|-------------|
| 장바구니 | `ShoppingCart` | 2.5 |
| 다운로드 | `Download` | 2.5 |
| 체크 | `Check` | 3 |
| 검색 | `Search` | 2.5 |
| 메뉴 | `Menu` | 2.5 |
| 닫기 | `X` | 2.5 |
| 사용자 | `User` | 2.5 |
| 하트 | `Heart` | 2.5 |
| 화살표 | `ArrowRight` | 2.5 |
| 별 | `Star` | 2.5 |

---

## 9. 애니메이션

### 9.1 기본 원칙

- 짧고 스냅하는 애니메이션 (150-200ms)
- 이징: `ease-out` 또는 `linear`
- 과한 애니메이션 지양 (브루탈리즘의 솔직함 유지)

### 9.2 인터랙션 애니메이션

```css
/* 버튼 눌림 효과 */
.neo-button {
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
}

.neo-button:hover {
  transform: translate(2px, 2px);
}

.neo-button:active {
  transform: translate(4px, 4px);
}

/* 카드 호버 - 살짝 떠오름 */
.neo-card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.neo-card:hover {
  transform: translate(-2px, -2px);
}
```

### 9.3 로딩 스피너

```jsx
// 기하학적 스피너 (네오브루탈리즘 스타일)
<div className="
  w-8 h-8
  border-4 border-neo-black
  border-t-neo-blue
  animate-spin
" style={{ borderRadius: '0' }} />  // 사각형 스피너

// 또는 기본 원형 (but 굵은 테두리)
<div className="
  w-8 h-8
  border-4 border-neo-cream
  border-t-neo-blue
  rounded-full
  animate-spin
" />

// 버튼 로딩 상태
<button disabled className="neo-button opacity-70">
  <Loader2 className="w-5 h-5 animate-spin mr-2" strokeWidth={2.5} />
  처리 중...
</button>
```

### 9.4 페이지 전환

```jsx
// 심플한 페이드
.page-enter {
  opacity: 0;
}
.page-enter-active {
  opacity: 1;
  transition: opacity 200ms ease-out;
}
```

---

## 10. 유틸리티 클래스

### 10.1 커스텀 유틸리티 (globals.css)

```css
@layer utilities {
  /* Neo-Brutalism 테두리 */
  .border-neo {
    @apply border-3 border-neo-black;
  }

  /* Neo-Brutalism 섀도우 */
  .shadow-neo {
    box-shadow: 4px 4px 0px 0px #1A1A1A;
  }

  .shadow-neo-sm {
    box-shadow: 2px 2px 0px 0px #1A1A1A;
  }

  .shadow-neo-lg {
    box-shadow: 6px 6px 0px 0px #1A1A1A;
  }

  /* 호버 눌림 효과 */
  .neo-press {
    @apply hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm;
    @apply active:translate-x-[4px] active:translate-y-[4px] active:shadow-none;
    @apply transition-all duration-150;
  }

  /* 호버 떠오름 효과 */
  .neo-lift {
    @apply hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg;
    @apply transition-all duration-200;
  }

  /* 회전 효과 (배지 등) */
  .neo-tilt {
    @apply rotate-[-2deg];
  }
}
```

### 10.2 컴포넌트 클래스

```css
@layer components {
  /* Primary Button */
  .btn-neo-primary {
    @apply px-6 py-3;
    @apply bg-neo-blue text-white;
    @apply border-3 border-neo-black;
    @apply shadow-neo;
    @apply font-bold uppercase tracking-wide;
    @apply neo-press;
  }

  /* Secondary Button */
  .btn-neo-secondary {
    @apply px-6 py-3;
    @apply bg-neo-pink text-white;
    @apply border-3 border-neo-black;
    @apply shadow-neo;
    @apply font-bold uppercase tracking-wide;
    @apply neo-press;
  }

  /* Outline Button */
  .btn-neo-outline {
    @apply px-6 py-3;
    @apply bg-neo-white text-neo-black;
    @apply border-3 border-neo-black;
    @apply shadow-neo;
    @apply font-bold;
    @apply hover:bg-neo-yellow;
    @apply neo-press;
  }

  /* Card */
  .card-neo {
    @apply bg-neo-white;
    @apply border-3 border-neo-black;
    @apply shadow-neo;
    @apply neo-lift;
  }

  /* Input */
  .input-neo {
    @apply w-full px-4 py-3;
    @apply bg-neo-white;
    @apply border-3 border-neo-black;
    @apply shadow-neo-sm;
    @apply font-medium;
    @apply focus:shadow-neo focus:border-neo-blue focus:outline-none;
    @apply transition-all duration-150;
  }

  /* Badge */
  .badge-neo {
    @apply inline-flex items-center;
    @apply px-3 py-1;
    @apply border-2 border-neo-black;
    @apply text-xs font-bold uppercase;
  }
}
```

---

## Decision Log

| 결정 | 이유 |
|------|------|
| 굵은 테두리 (3px) | 네오브루탈리즘의 핵심 요소, 명확한 경계 |
| 하드 섀도우 (4px offset) | 깊이감 + 장난스러움, 호버 시 변화 |
| Off-White 배경 (#FFFDF7) | 순백색보다 따뜻하고 눈 피로 감소 |
| 비비드 컬러 팔레트 | 주목도 높음, 즐거운 느낌 |
| Space Grotesk 폰트 | 기하학적이고 대담한 제목 |
| 150-200ms 애니메이션 | 스냅하고 반응적인 느낌 |
| 큰 클릭 영역 (44px+) | 접근성 + 대담한 디자인 |
| 대문자 라벨/버튼 | 강조 효과, 브루탈 느낌 |
| 다크 모드 v2 | 네온 효과와 반전된 섀도우로 차별화 예정 |
