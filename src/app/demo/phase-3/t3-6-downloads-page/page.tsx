/**
 * Demo: Downloads Page
 *
 * P3-T3.6: 다운로드 센터 페이지 데모
 * - loading: 로딩 상태
 * - empty: 빈 상태
 * - with-downloads: 다운로드 목록 있음
 * - expired: 만료된 다운로드
 */

'use client';

import { useState } from 'react';
import { Download, FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatFileSize, formatExpirationDate, getRemainingDays } from '@/types/download';

type DemoState = 'loading' | 'empty' | 'with-downloads' | 'expired';

const MOCK_DOWNLOADS = [
  {
    id: 'download-1',
    productName: 'Next.js 완벽 가이드',
    fileName: 'nextjs-guide.pdf',
    fileSize: 1024 * 1024 * 15, // 15MB
    thumbnailUrl: 'https://ui-avatars.com/api/?name=Next.js&size=200&background=0066FF&color=fff',
    downloadCount: 2,
    downloadLimit: 10,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastDownloadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active' as const,
  },
  {
    id: 'download-2',
    productName: 'TypeScript 실전 프로젝트',
    fileName: 'typescript-project.zip',
    fileSize: 1024 * 1024 * 50, // 50MB
    thumbnailUrl: null,
    downloadCount: 5,
    downloadLimit: 5,
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastDownloadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'limit_exceeded' as const,
  },
  {
    id: 'download-3',
    productName: 'React 상태관리 마스터',
    fileName: 'react-state-management.pdf',
    fileSize: 1024 * 1024 * 8, // 8MB
    thumbnailUrl: 'https://ui-avatars.com/api/?name=React&size=200&background=61DAFB&color=000',
    downloadCount: 1,
    downloadLimit: 3,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastDownloadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'active' as const,
  },
];

const EXPIRED_DOWNLOADS = [
  {
    id: 'download-expired',
    productName: '만료된 E-book',
    fileName: 'expired-ebook.pdf',
    fileSize: 1024 * 1024 * 5,
    thumbnailUrl: null,
    downloadCount: 3,
    downloadLimit: 10,
    expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastDownloadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'expired' as const,
  },
];

export default function DownloadsPageDemo() {
  const [state, setState] = useState<DemoState>('with-downloads');

  const downloads = state === 'expired' ? EXPIRED_DOWNLOADS : state === 'with-downloads' ? MOCK_DOWNLOADS : [];

  return (
    <div className="min-h-screen bg-neo-white">
      {/* Demo Controls */}
      <div className="bg-neo-cream border-b-3 border-neo-black p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-black text-neo-black uppercase mb-3">
            Demo Controls
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setState('loading')}
              className={`
                px-4 py-2 border-3 border-neo-black font-bold text-sm uppercase
                ${state === 'loading' ? 'bg-neo-blue text-white' : 'bg-white text-neo-black'}
                hover:translate-x-[2px] hover:translate-y-[2px] transition-all
              `}
            >
              Loading
            </button>
            <button
              onClick={() => setState('empty')}
              className={`
                px-4 py-2 border-3 border-neo-black font-bold text-sm uppercase
                ${state === 'empty' ? 'bg-neo-blue text-white' : 'bg-white text-neo-black'}
                hover:translate-x-[2px] hover:translate-y-[2px] transition-all
              `}
            >
              Empty
            </button>
            <button
              onClick={() => setState('with-downloads')}
              className={`
                px-4 py-2 border-3 border-neo-black font-bold text-sm uppercase
                ${state === 'with-downloads' ? 'bg-neo-blue text-white' : 'bg-white text-neo-black'}
                hover:translate-x-[2px] hover:translate-y-[2px] transition-all
              `}
            >
              With Downloads
            </button>
            <button
              onClick={() => setState('expired')}
              className={`
                px-4 py-2 border-3 border-neo-black font-bold text-sm uppercase
                ${state === 'expired' ? 'bg-neo-blue text-white' : 'bg-white text-neo-black'}
                hover:translate-x-[2px] hover:translate-y-[2px] transition-all
              `}
            >
              Expired
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="p-4 py-8 sm:p-8">
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

          {/* Loading State */}
          {state === 'loading' && (
            <div className="bg-neo-white border-3 border-neo-black shadow-neo p-12 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-neo-black/10 border-2 border-neo-black/20"></div>
                <div className="h-24 bg-neo-black/10 border-2 border-neo-black/20"></div>
                <div className="h-24 bg-neo-black/10 border-2 border-neo-black/20"></div>
              </div>
              <p className="text-lg font-bold text-neo-black mt-6">로딩 중...</p>
            </div>
          )}

          {/* Empty State */}
          {state === 'empty' && (
            <div className="bg-neo-cream border-3 border-neo-black shadow-neo p-12 text-center">
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
          {(state === 'with-downloads' || state === 'expired') && (
            <div className="space-y-4">
              {downloads.map((item) => {
                const isActive = item.status === 'active';
                const isExpired = item.status === 'expired';
                const isLimitExceeded = item.status === 'limit_exceeded';
                const remainingDays = getRemainingDays(item.expiresAt);

                return (
                  <div
                    key={item.id}
                    className="bg-neo-white border-3 border-neo-black shadow-neo p-6"
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
                        <h2 className="text-xl font-black text-neo-black mb-1 truncate">
                          {item.productName}
                        </h2>
                        <p className="text-sm text-neo-black/70 mb-3 truncate">
                          {item.fileName}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-neo-black/60">크기:</span>
                            <span className="font-medium text-neo-black">
                              {formatFileSize(item.fileSize)}
                            </span>
                          </div>
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
                          <button
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
                          </button>
                        ) : (
                          <button
                            disabled
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

                    {/* Status Messages */}
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
    </div>
  );
}
