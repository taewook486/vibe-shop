# Google & Kakao OAuth 설정 가이드

이 가이드는 Vibe Store에 Google OAuth와 Kakao OAuth를 추가하는 방법을 단계별로 안내합니다.

---

## 목차

1. [Google OAuth 설정](#1-google-oauth-설정)
2. [Kakao OAuth 설정](#2-kakao-oauth-설정)
3. [환경변수 설정](#3-환경변수-설정)
4. [Vercel 배포 설정](#4-vercel-배포-설정)
5. [테스트](#5-테스트)

---

## 1. Google OAuth 설정

### 1.1 Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 상단 프로젝트 선택 드롭다운에서 **"새 프로젝트"** 클릭
3. 프로젝트 이름 입력 (예: `Vibe Store`)
4. **"만들기"** 클릭

### 1.2 OAuth 동의 화면 구성

1. 왼쪽 메뉴에서 **"API 및 서비스"** > **"OAuth 동의 화면"** 클릭
2. **"외부"** 선택 후 **"만들기"** 클릭

#### 1.2.1 OAuth 동의 화면 정보

| 필드 | 값 |
|------|-----|
| 앱 이름 | Vibe Store |
| 사용자 지원 이메일 | 본인 이메일 |
| 앱 로고 | (선택사항) 로고 이미지 업로드 |
| 홈페이지 | `https://vibe-shop-swart.vercel.app` |
| 개인정보처리방침 URL | `https://vibe-shop-swart.vercel.app/privacy` |
| 서비스 약관 URL | `https://vibe-shop-swart.vercel.app/terms` |
| 승인된 도메인 | `vibe-shop-swart.vercel.app` |
| 개발자 연락처 정보 | 본인 이메일 |

#### 1.2.2 범위 (Scopes)

필요한 범위 추가:
- `../auth/userinfo.email`
- `../auth/userinfo.profile`

**"저장 후 계속"** 클릭

#### 1.2.3 테스트 사용자

- **"테스트 사용자 추가"** 클릭
- 테스트할 이메일 주소 입력
- 개발 단계에서는 본인 이메일만 추가해도 충분

**"저장 후 계속"** 클릭

### 1.3 OAuth 2.0 클라이언트 ID 생성

1. 왼쪽 메뉴에서 **"사용자 인증 정보"** 클릭
2. 상단 **"+ 사용자 인증 정보 만들기"** 클릭
3. **"OAuth 클라이언트 ID"** 선택

#### 1.3.1 애플리케이션 유형

- **애플리케이션 유형**: **웹 애플리케이션**

#### 1.3.2 승인된 리디렉션 URI

다음 URI를 추가합니다 (로컬 개발용):

```
http://localhost:3000/api/auth/callback/google
```

프로덕션용 URI도 추가:

```
https://vibe-shop-swart.vercel.app/api/auth/callback/google
```

**"만들기"** 클릭

### 1.4 클라이언트 ID 및 시크릿 확인

다음 정보를 복사하여 `.env.local` 파일에 저장:

```bash
GOOGLE_CLIENT_ID=구글-클라이언트-ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=구글-클라이언트-시크릿
```

---

## 2. Kakao OAuth 설정

### 2.1 Kakao Developers 접속

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 로그인 후 **"내 애플리케이션"** 클릭
3. **"애플리케이션 만들기"** 클릭

### 2.2 앱 설정

#### 2.2.1 기본 정보

| 필드 | 값 |
|------|-----|
| 앱 이름 | Vibe Store |
| 설명 | 디지털 상품 쇼핑몰 |
| 아이콘 | (선택사항) 로고 이미지 업로드 |

**"저장"** 클릭

### 2.3 플랫폼 추가

1. 생성된 앱 선택
2. **"앱 설정"** 탭 > **"플랫폼"** 클릭
3. **"플랫폼 등록"** > **"웹"** 선택

#### 2.3.1 웹 플랫폼 등록

| 필드 | 값 |
|------|-----|
| 도메인 | `http://localhost:3000` |
| 도메인 | `https://vibe-shop-swart.vercel.app` |

**"등록"** 클릭

### 2.4 카카오 로그인 활성화

1. **"제품 설정"** 탭 > **"카카오 로그인"** 클릭
2. **"카카오 로그인 활성화"** 스위치 ON

#### 2.4.1 동의 항목

필요한 동의 항목 설정:

| 항목 | 필수 여부 | 설명 |
|------|----------|------|
| 닉네임 | 필수 | 사용자 닉네임 |
| 이메일 | 필수 | 사용자 이메일 |

**"저장"** 클릭

### 2.5 Redirect URI 등록

1. **"카카오 로그인"** > **"Redirect URI"** 탭
2. 다음 URI 추가:

**로컬 개발용**:
```
http://localhost:3000/api/auth/callback/kakao
```

**프로덕션용**:
```
https://vibe-shop-swart.vercel.app/api/auth/callback/kakao
```

**"저장"** 클릭

### 2.6 앱 키 확인

1. **"앱 설정"** 탭 > **"앱 키"** 클릭
2. **REST API 키** 복사

```bash
KAKAO_CLIENT_ID=카카오-rest-api-key
KAKAO_CLIENT_SECRET=  # 선택사항 (비워둬도 됨)
```

---

## 3. 환경변수 설정

### 3.1 로컬 개발 환경

`.env.local` 파일에 다음 내용 추가:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=구글-클라이언트-ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=구글-클라이언트-시크릿

# Kakao OAuth
KAKAO_CLIENT_ID=카카오-rest-api-key
KAKAO_CLIENT_SECRET=
```

### 3.2 환경변수 확인

```bash
# 환경변수 로드 확인
cat .env.local | grep -E "(GOOGLE|KAKAO)"
```

---

## 4. Vercel 배포 설정

### 4.1 Vercel 프로젝트 설정

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **Vibe Store** 프로젝트 선택
3. **"Settings"** 탭 > **"Environment Variables"** 클릭

### 4.2 환경변수 추가

다음 환경변수들을 Vercel에 추가:

| 변수명 | 값 | 환경 |
|--------|-----|------|
| `GOOGLE_CLIENT_ID` | 구글 클라이언트 ID | Production, Preview |
| `GOOGLE_CLIENT_SECRET` | 구글 클라이언트 시크릿 | Production, Preview |
| `KAKAO_CLIENT_ID` | 카카오 REST API 키 | Production, Preview |
| `KAKAO_CLIENT_SECRET` | (비워둠) | Production, Preview |

### 4.3 재배포

환경변수 추가 후 자동으로 재배포되거나, **"Deployments"** 탭에서 수동으로 재배포:

1. 최신 배포 선택
2. **"Redeploy"** 클릭

---

## 5. 테스트

### 5.1 로컬 테스트

1. 개발 서버 시작:
   ```bash
   npm run dev
   ```

2. 로그인 페이지 접속:
   ```
   http://localhost:3000/auth/login
   ```

3. **"Google로 계속하기"** 버튼 클릭
4. Google 로그인 완료 후 자동으로 회원가입됨

5. **"Kakao로 계속하기"** 버튼 클릭
6. Kakao 로그인 완료 후 자동으로 회원가입됨

### 5.2 프로덕션 테스트

1. 프로덕션 URL 접속:
   ```
   https://vibe-shop-swart.vercel.app/auth/login
   ```

2. 동일한 단계로 OAuth 로그인 테스트

### 5.3 데이터베이스 확인

Supabase 대시보드에서 `profiles` 테이블 확인:

```sql
SELECT id, email, nickname, google_id, kakao_id, created_at
FROM profiles
WHERE google_id IS NOT NULL OR kakao_id IS NOT NULL
ORDER BY created_at DESC;
```

---

## 문제 해결

### 문제 1: "redirect_uri_mismatch" 에러 (Google)

**원인**: 승인된 리디렉션 URI가 일치하지 않음

**해결**:
1. Google Cloud Console > "사용자 인증 정보"
2. OAuth 2.0 클라이언트 ID 수정
3. 정확한 URI 추가:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://vibe-shop-swart.vercel.app/api/auth/callback/google`

### 문제 2: "invalid_client" 에러 (Kakao)

**원인**: 잘못된 클라이언트 ID 또는 Redirect URI 미등록

**해결**:
1. Kakao Developers > "앱 키"에서 REST API 키 확인
2. "Redirect URI"에 다음이 등록되어 있는지 확인:
   - `http://localhost:3000/api/auth/callback/kakao`
   - `https://vibe-shop-swart.vercel.app/api/auth/callback/kakao`

### 문제 3: OAuth 로그인 후 세션이 유지되지 않음

**원인**: `AUTH_SECRET`이 설정되지 않았거나 일치하지 않음

**해결**:
1. `.env.local`에 `AUTH_SECRET` 설정
2. Vercel에도 동일한 `AUTH_SECRET` 설정
3. 개발 서버 재시작

### 문제 4: 자동 회원가입되지 않음

**원인**: OAuth 콜백 핸들러에서 에러 발생

**해결**:
1. 브라우저 개발자 도구 콘솔에서 에러 확인
2. NextAuth 로그 확인: `src/lib/auth.ts`의 `console.log`로 디버깅
3. Supabase RLS 정책 확인: profiles 테이블에 INSERT 권한 있는지 확인

---

## 참고 자료

- [NextAuth.js Google Provider](https://authjs.dev/reference/core/providers/google)
- [NextAuth.js Kakao Provider](https://authjs.dev/reference/core/providers/kakao)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Kakao Developers](https://developers.kakao.com/)

---

## 다음 단계

OAuth 설정이 완료되면:

1. ✅ 로그인 페이지에서 OAuth 버튼 표시
2. ✅ Google/Kakao로 간편 로그인
3. ✅ 신규 사용자 자동 회원가입
4. ✅ 기존 사용자 계정 연동

**팁**: 로그인 경험을 더 개선하려면:
- 소셜 로그인 사용자의 비밀번호 변경 기능 비활성화
- 프로필 페이지에서 OAuth 제공자 표시
- 연동된 OAuth 계정 관리 기능 추가
