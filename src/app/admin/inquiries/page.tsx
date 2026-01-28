/**
 * Admin Inquiries Management Page
 *
 * Features:
 * - 문의 목록 조회 및 필터링
 * - 답변 작성
 * - 상태 변경
 * - 답변 템플릿
 */

import InquiryManagement from '@/components/admin/inquiry-management';

export const metadata = {
  title: '문의 관리 - Vibe Store Admin',
  description: '고객 문의를 관리합니다.',
};

export default function AdminInquiriesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">문의 관리</h1>
        <p className="text-muted-foreground">
          고객 문의를 조회하고 답변을 작성할 수 있습니다.
        </p>
      </div>

      <InquiryManagement />
    </div>
  );
}
