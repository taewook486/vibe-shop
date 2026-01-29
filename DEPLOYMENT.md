# Vercel 배포 가이드

## 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

1. **Vercel Dashboard 접속**
   - https://vercel.com/comfit99-4265s-projects/vibeshop/settings/environment-variables

2. **필수 환경 변수 추가**

   다음 환경 변수들을 모두 추가하세요:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://rwuvldzhpfnlrnyykyxl.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_8u7DWLAVUs-iqi1mYuIgA__wVaV4YK
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3dXZsZHpocGZubHJueXlreXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0ODEwMzgsImV4cCI6MjA4NTA1NzAzOH0.tlIFlzoVoAhBasC_Z7HtDBQPWDerMfs47a6JhXl0gPg
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3dXZsZHpocGZubHJueXlreXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ4MTAzOCwiZXhwIjoyMDg1MDU3MDM4fQ.EGvCzORxiGKHPNRlqF6JJXTq32rhHd7vL_pXzXgBeiM
   ```

3. **환경 변수 설정 단계**

   - 각 변수마다:
     1. "Add New" 버튼 클릭
     2. Name 필드에 변수명 입력 (예: `NEXT_PUBLIC_SUPABASE_URL`)
     3. Value 필드에 변수값 입력
     4. Environment: All 선택 (Production, Preview, Development 모두)
     5. "Save" 클릭

4. **재배포**

   환경 변수 설정 완료 후:
   - Vercel Dashboard → Deployments 탭
   - 최신 배포를 찾아 "Redeploy" 클릭

## Supabase Storage 설정 (선택사항)

다운로드 기능을 사용하려면 Supabase Storage 버킷을 생성해야 합니다:

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard/project/rwuvldzhpfnlrnyykyxl/storage

2. **버킷 생성**
   - "Create a new bucket" 클릭
   - Bucket name: `product-files`
   - Public bucket: 체크 해제 (비공개)
   - File size limit: 50MB
   - Allowed MIME types: 비워둠

3. **RLS 정책 설정**
   ```sql
   -- 인증된 사용자만 다운로드 가능
   CREATE POLICY "Authenticated users can download"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'product-files');

   -- 파일 업로드는 관리자만
   CREATE POLICY "Admins can upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'product-files');
   ```

4. **파일 업로드**
   - `product-files` 버킷에 실제 제품 파일 업로드
   - `product_files` 테이블의 `file_path` 업데이트

## 배포 확인

- **Production URL**: https://vibeshop-nu9nbudo8-comfit99-4265s-projects.vercel.app
- **GitHub Repository**: https://github.com/taewook486/vibe-shop

## 문제 해결

### 배포 실패: "supabaseUrl is required"
- 환경 변수가 제대로 설정되었는지 확인
- Vercel Dashboard → Settings → Environment Variables에서 `NEXT_PUBLIC_SUPABASE_URL` 확인

### 다운로드 실패: "SIGNED_URL_CREATION_FAILED"
- Supabase Storage 버킷이 생성되었는지 확인
- 버킷 이름이 `product-files`인지 확인
- `product_files` 테이블에 데이터가 있는지 확인

## 추가 정보

- **프로젝트 문서**: [CHANGELOG.md](./CHANGELOG.md)
- **Supabase Dashboard**: https://supabase.com/dashboard/project/rwuvldzhpfnlrnyykyxl
- **Vercel Dashboard**: https://vercel.com/comfit99-4265s-projects/vibeshop
