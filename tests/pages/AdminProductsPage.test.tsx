/**
 * P4-T4.6: 관리자 상품 관리 페이지 테스트
 *
 * 테스트 범위:
 * 1. 상품 목록 조회 및 표시
 * 2. 상품 검색 및 필터링
 * 3. 상품 생성 폼
 * 4. 상품 수정 폼
 * 5. 상품 상태 변경 (draft/active/hidden)
 * 6. 이미지 및 파일 업로드
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminProductsPage from '@/app/admin/products/page';
import { createServerClient } from '@/lib/supabase/server';

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => Promise.resolve({
    get: vi.fn(),
  }),
}));

describe('AdminProductsPage', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Next.js 쇼핑몰 템플릿',
      slug: 'nextjs-shop-template',
      price: 49000,
      discount_price: null,
      status: 'active',
      is_featured: true,
      category: {
        id: 'cat1',
        name: '템플릿',
        slug: 'templates',
      },
      created_at: '2026-01-20T00:00:00Z',
      sales_count: 15,
    },
    {
      id: '2',
      name: 'React 컴포넌트 라이브러리',
      slug: 'react-component-library',
      price: 89000,
      discount_price: 69000,
      status: 'draft',
      is_featured: false,
      category: {
        id: 'cat2',
        name: '라이브러리',
        slug: 'libraries',
      },
      created_at: '2026-01-21T00:00:00Z',
      sales_count: 0,
    },
  ];

  const mockCategories = [
    { id: 'cat1', name: '템플릿', slug: 'templates' },
    { id: 'cat2', name: '라이브러리', slug: 'libraries' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('상품 목록 조회', () => {
    it('상품 목록을 로드하고 표시한다', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'admin-id',
                user_metadata: { role: 'admin' },
              },
            },
          }),
        },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          range: vi.fn().mockResolvedValue({
            data: mockProducts,
            error: null,
            count: 2,
          }),
        })),
      };

      (createServerClient as any).mockResolvedValue(mockSupabase);

      render(await AdminProductsPage({ searchParams: Promise.resolve({}) }));

      await waitFor(() => {
        expect(screen.getByText('Next.js 쇼핑몰 템플릿')).toBeInTheDocument();
        expect(screen.getByText('React 컴포넌트 라이브러리')).toBeInTheDocument();
      });
    });

    it('상품 상태 배지를 올바르게 표시한다', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'admin-id',
                user_metadata: { role: 'admin' },
              },
            },
          }),
        },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          range: vi.fn().mockResolvedValue({
            data: mockProducts,
            error: null,
            count: 2,
          }),
        })),
      };

      (createServerClient as any).mockResolvedValue(mockSupabase);

      render(await AdminProductsPage({ searchParams: Promise.resolve({}) }));

      await waitFor(() => {
        expect(screen.getByText('active')).toBeInTheDocument();
        expect(screen.getByText('draft')).toBeInTheDocument();
      });
    });
  });
});
