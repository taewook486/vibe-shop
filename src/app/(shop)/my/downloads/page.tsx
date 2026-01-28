/**
 * Downloads Page
 *
 * P3-T3.6: 다운로드 센터 페이지
 * - 구매한 상품 파일 목록 표시
 * - 다운로드 버튼, 남은 횟수/기간 표시
 * - 만료된 다운로드 비활성화
 * - Neo-Brutalism 스타일
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import {
  DownloadItem,
  formatFileSize,
  getDownloadStatus,
  formatExpirationDate,
  getRemainingDays,
} from '@/types/download';
import { Download, FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Convert database record to display item
 * Note: max_downloads is on downloads table, not product_files
 */
function toDownloadItem(download: any): DownloadItem {
  const maxDownloads = download.max_downloads || 5;
  const status = getDownloadStatus(
    download.download_count,
    maxDownloads,
    download.expires_at
  );

  return {
    id: download.id,
    productName: download.product_file.product.name,
    fileName: download.product_file.name,
    fileSize: download.product_file.file_size,
    thumbnailUrl: download.product_file.product.thumbnail_url,
    downloadCount: download.download_count,
    downloadLimit: maxDownloads,
    expiresAt: download.expires_at,
    lastDownloadedAt: download.last_downloaded_at,
    status,
    remainingDownloads: maxDownloads - download.download_count,
  };
}

export default async function DownloadsPage() {
  // 1. Check authentication (NextAuth)
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?redirect=/my/downloads');
    return null;
  }

  const userId = session.user.id;

  // 2. Use admin client to bypass RLS (filter by user_id manually)
  const supabase = createAdminClient();

  // 2. Fetch downloads with product file info (join through order_items → orders for user filtering)
  const { data: downloads, error: downloadsError } = await supabase
    .from('downloads')
    .select(
      `
      id,
      order_item_id,
      product_file_id,
      download_count,
      max_downloads,
      expires_at,
      last_downloaded_at,
      created_at,
      product_file:product_files (
        id,
        product_id,
        name,
        file_size,
        file_path,
        created_at,
        product:products (
          name,
          thumbnail_url:metadata->thumbnail_url
        )
      ),
      order_item:order_items (
        order:orders (
          user_id
        )
      )
    `
    )
    .order('created_at', { ascending: false });

  // 3. Handle errors
  if (downloadsError) {
    return (
      <div className="min-h-screen bg-neo-white p-4 py-8 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="
              bg-[#FFE6E6]
              border-3 border-[#FF3333]
              shadow-neo-pink
              p-6
            "
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-[#FF3333]" strokeWidth={2.5} />
              <div>
                <h2 className="text-lg font-black text-neo-black uppercase">오류가 발생했습니다</h2>
                <p className="text-sm text-neo-black/70 mt-1">{downloadsError.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Filter by user_id (through order_items → orders) and validate data
  const validDownloads = (downloads || []).filter((d): d is any => {
    // Check if product_file and product exist
    if (!d.product_file || !(d.product_file as any).product) {
      return false;
    }
    // Filter by user_id through the relationship
    const orderUserId = (d.order_item as any)?.order?.user_id;
    return orderUserId === userId;
  });

  const downloadItems: DownloadItem[] = validDownloads.map((d) => toDownloadItem(d));

  return (
    <div className="min-h-screen bg-neo-white p-4 py-8 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-neo-black uppercase tracking-tight">
            다운로드 센터
          </h1>
          <p className="text-base text-neo-black/70 mt-2">
            구매한 상품을 다운로드하세요
          </p>
        </div>

        {/* Empty State */}
        {downloadItems.length === 0 && (
          <div
            className="
              bg-neo-cream
              border-3 border-neo-black
              shadow-neo
              p-12
              text-center
            "
          >
            <FileText className="w-16 h-16 text-neo-black/40 mx-auto mb-4" strokeWidth={2} />
            <h2 className="text-2xl font-black text-neo-black uppercase mb-2">
              다운로드 가능한 파일이 없습니다
            </h2>
            <p className="text-sm text-neo-black/60 mb-6">
              상품을 구매하면 여기에서 다운로드할 수 있습니다
            </p>
            <Link
              href="/products"
              className="
                inline-block
                px-6 py-3
                bg-neo-blue
                text-white
                border-3 border-neo-black
                shadow-neo
                font-bold uppercase tracking-wide

                hover:translate-x-[2px] hover:translate-y-[2px]
                hover:shadow-neo-sm

                active:translate-x-[4px] active:translate-y-[4px]
                active:shadow-none

                transition-all duration-150
              "
            >
              상품 둘러보기
            </Link>
          </div>
        )}

        {/* Downloads List */}
        {downloadItems.length > 0 && (
          <div className="space-y-4">
            {downloadItems.map((item) => {
              const isActive = item.status === 'active';
              const isExpired = item.status === 'expired';
              const isLimitExceeded = item.status === 'limit_exceeded';
              const remainingDays = getRemainingDays(item.expiresAt);

              return (
                <div
                  key={item.id}
                  className="
                    bg-neo-white
                    border-3 border-neo-black
                    shadow-neo
                    p-6
                  "
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <div
                        className="
                          w-24 h-24
                          border-3 border-neo-black
                          shadow-neo-sm
                          overflow-hidden
                          bg-neo-cream
                          flex items-center justify-center
                        "
                      >
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.productName}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-12 h-12 text-neo-black/40" strokeWidth={2} />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {/* Product Name */}
                      <h2 className="text-xl font-black text-neo-black mb-1 truncate">
                        {item.productName}
                      </h2>

                      {/* File Name */}
                      <p className="text-sm text-neo-black/70 mb-3 truncate">
                        {item.fileName}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-xs">
                        {/* File Size */}
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-neo-black/60">크기:</span>
                          <span className="font-medium text-neo-black">
                            {formatFileSize(item.fileSize)}
                          </span>
                        </div>

                        {/* Download Count */}
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-neo-black/60">다운로드:</span>
                          <span
                            className={`font-medium ${
                              isLimitExceeded ? 'text-[#FF3333]' : 'text-neo-black'
                            }`}
                          >
                            {item.downloadCount}/{item.downloadLimit}회
                          </span>
                        </div>

                        {/* Expiration Date */}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-neo-black/60" strokeWidth={2.5} />
                          <span
                            className={`font-medium text-xs ${
                              isExpired
                                ? 'text-[#FF3333]'
                                : remainingDays <= 5
                                ? 'text-[#F59E0B]'
                                : 'text-neo-black'
                            }`}
                          >
                            {formatExpirationDate(item.expiresAt)}까지
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="flex-shrink-0 flex items-center">
                      {isActive ? (
                        <Link
                          href={`/api/downloads/${item.id}`}
                          className="
                            px-6 py-3
                            bg-neo-blue
                            text-white
                            border-3 border-neo-black
                            shadow-neo
                            font-bold uppercase tracking-wide text-sm
                            flex items-center gap-2
                            whitespace-nowrap

                            hover:translate-x-[2px] hover:translate-y-[2px]
                            hover:shadow-neo-sm

                            active:translate-x-[4px] active:translate-y-[4px]
                            active:shadow-none

                            transition-all duration-150
                          "
                        >
                          <Download className="w-5 h-5" strokeWidth={2.5} />
                          <span>다운로드</span>
                        </Link>
                      ) : (
                        <button
                          disabled
                          aria-disabled="true"
                          className="
                            px-6 py-3
                            bg-neo-black/10
                            text-neo-black/40
                            border-3 border-neo-black/30
                            shadow-none
                            font-bold uppercase tracking-wide text-sm
                            flex items-center gap-2
                            whitespace-nowrap
                            cursor-not-allowed
                          "
                        >
                          {isExpired && (
                            <>
                              <AlertCircle className="w-5 h-5" strokeWidth={2.5} />
                              <span>만료됨</span>
                            </>
                          )}
                          {isLimitExceeded && (
                            <>
                              <AlertCircle className="w-5 h-5" strokeWidth={2.5} />
                              <span>다운로드 횟수 초과</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Message */}
                  {isActive && remainingDays <= 5 && (
                    <div className="mt-4 pt-4 border-t-2 border-neo-black/10">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-[#F59E0B]" strokeWidth={2.5} />
                        <span className="font-medium text-[#F59E0B]">
                          다운로드 기간이 {remainingDays}일 남았습니다
                        </span>
                      </div>
                    </div>
                  )}

                  {item.lastDownloadedAt && isActive && (
                    <div className="mt-4 pt-4 border-t-2 border-neo-black/10">
                      <div className="flex items-center gap-2 text-xs text-neo-black/60">
                        <CheckCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                        <span className="font-medium">
                          마지막 다운로드:{' '}
                          {new Date(item.lastDownloadedAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
