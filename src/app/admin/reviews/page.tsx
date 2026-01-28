/**
 * Admin Reviews Management Page
 *
 * Features:
 * - 후기 목록 조회 및 필터링 (별점, 기간)
 * - 베스트 후기 선정
 * - 후기 삭제
 * - 일괄 처리
 */

import ReviewManagement from '@/components/admin/review-management';

export const metadata = {
  title: '후기 관리 - Vibe Store Admin',
  description: '상품 후기를 관리합니다.',
};

export default function AdminReviewsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">후기 관리</h1>
        <p className="text-muted-foreground">
          고객 후기를 조회하고 베스트 후기를 선정할 수 있습니다.
        </p>
      </div>

      <ReviewManagement />
    </div>
  );
}
