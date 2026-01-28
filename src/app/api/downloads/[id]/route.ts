/**
 * Downloads API Route Handler
 *
 * GET /api/downloads/[id]
 * - Signed URL 생성 및 다운로드 권한 검증
 * - 다운로드 카운트 증가
 *
 * 검증 항목:
 * - 인증된 사용자인지 확인
 * - 본인 구매 상품인지 확인
 * - 결제 완료된 주문인지 확인
 * - 만료일(expires_at) 확인
 * - 다운로드 횟수(download_count < max_downloads) 확인
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/downloads/[id]
 * Signed URL 생성 및 리다이렉트
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    // 1. NextAuth 세션 확인
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: '로그인이 필요합니다.',
          },
        },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    // 2. 다운로드 권한 조회 (order_item, product_file 조인)
    const { data: downloadData, error: downloadError } = await supabase
      .from('downloads')
      .select(
        `
        id,
        download_count,
        max_downloads,
        expires_at,
        product_file:product_files (
          id,
          file_path
        ),
        order_item:order_items (
          order:orders (
            user_id,
            status
          )
        )
      `
      )
      .eq('id', id)
      .single();

    if (downloadError || !downloadData) {
      return NextResponse.json(
        {
          error: {
            code: 'DOWNLOAD_NOT_FOUND',
            message: '다운로드 권한을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 타입 단언으로 복잡한 조인 타입 처리
    const download = downloadData as any;

    // 타입 가드
    if (
      !download.product_file ||
      !download.order_item ||
      !download.order_item.order
    ) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_DOWNLOAD_DATA',
            message: '다운로드 데이터가 유효하지 않습니다.',
          },
        },
        { status: 500 }
      );
    }

    // 3. 본인 소유 확인 (through order_items → orders)
    const orderUserId = download.order_item.order.user_id;
    if (orderUserId !== userId) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: '접근 권한이 없습니다.',
          },
        },
        { status: 403 }
      );
    }

    // 4. 결제 완료 확인
    const orderStatus = download.order_item.order.status;
    if (orderStatus !== 'paid' && orderStatus !== 'completed') {
      return NextResponse.json(
        {
          error: {
            code: 'ORDER_NOT_PAID',
            message: '결제가 완료되지 않은 주문입니다.',
          },
        },
        { status: 403 }
      );
    }

    // 5. 만료일 확인
    const expiresAt = new Date(download.expires_at);
    const now = new Date();
    if (expiresAt < now) {
      return NextResponse.json(
        {
          error: {
            code: 'DOWNLOAD_EXPIRED',
            message: '다운로드 기간이 만료되었습니다.',
          },
        },
        { status: 410 } // Gone
      );
    }

    // 6. 다운로드 횟수 확인 (max_downloads is on downloads table)
    const maxDownloads = download.max_downloads || 5;
    if (download.download_count >= maxDownloads) {
      return NextResponse.json(
        {
          error: {
            code: 'DOWNLOAD_LIMIT_EXCEEDED',
            message: `다운로드 횟수가 초과되었습니다. (최대 ${maxDownloads}회)`,
          },
        },
        { status: 429 } // Too Many Requests
      );
    }

    // 7. Signed URL 생성 (1시간 유효)
    const { file_path } = download.product_file;
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('product-files')
      .createSignedUrl(file_path, 3600); // 1시간

    if (signedUrlError || !signedUrlData) {
      return NextResponse.json(
        {
          error: {
            code: 'SIGNED_URL_CREATION_FAILED',
            message: '다운로드 URL 생성에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    // 8. 다운로드 카운트 증가
    const { error: updateError } = await supabase
      .from('downloads')
      .update({
        download_count: download.download_count + 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update download count:', updateError);
      // 카운트 업데이트 실패해도 다운로드는 허용
    }

    // 9. Signed URL로 리다이렉트
    return NextResponse.redirect(signedUrlData.signedUrl, 307); // Temporary Redirect
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
