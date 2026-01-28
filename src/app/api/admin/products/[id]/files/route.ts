/**
 * P4-T4.3: 관리자 상품 파일 API
 *
 * POST /api/admin/products/[id]/files - 파일 업로드
 * DELETE /api/admin/products/[id]/files - 파일 삭제
 *
 * 권한: 관리자 전용
 * 기능: 디지털 상품 파일 업로드 (Supabase Storage)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/middleware/admin';
import { z } from 'zod';

// ============================================================================
// POST /api/admin/products/[id]/files - 파일 업로드
// ============================================================================

/**
 * 파일 업로드 스키마
 */
const uploadFilesSchema = z.object({
  files: z.array(
    z.object({
      name: z.string().min(1).max(255),
      file_path: z.string().min(1).max(500),
      file_size: z.number().int().positive(),
      file_type: z.string().min(1).max(100),
      download_limit: z.number().int().min(0).default(5),
    })
  ),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    // 1. 인증 및 권한 체크 (NextAuth)
    const adminCheck = await checkAdminRole();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: '관리자 권한이 필요합니다.',
          },
        },
        { status: 403 }
      );
    }

    const supabase = await createServerClient();

    // 2. 상품 존재 확인
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', resolvedParams.id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: '상품을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 3. 요청 바디 검증
    const body = await request.json();
    const validated = uploadFilesSchema.parse(body);

    // 4. 파일 메타데이터 삽입
    const filesToInsert = validated.files.map((file) => ({
      product_id: resolvedParams.id,
      name: file.name,
      file_path: file.file_path,
      file_size: file.file_size,
      file_type: file.file_type,
      download_limit: file.download_limit,
    }));

    const { data: files, error } = await supabase
      .from('product_files')
      .insert(filesToInsert)
      .select();

    if (error) {
      console.error('File upload error:', error);
      return NextResponse.json(
        {
          error: {
            code: 'UPLOAD_ERROR',
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: files,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '입력값이 올바르지 않습니다.',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/admin/products/[id]/files - 파일 삭제
// ============================================================================

/**
 * 파일 삭제 스키마
 */
const deleteFilesSchema = z.object({
  file_ids: z.array(z.string().uuid()),
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    // 1. 인증 및 권한 체크 (NextAuth)
    const adminCheck = await checkAdminRole();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: '관리자 권한이 필요합니다.',
          },
        },
        { status: 403 }
      );
    }

    const supabase = await createServerClient();

    // 2. 요청 바디 검증
    const body = await request.json();
    const validated = deleteFilesSchema.parse(body);

    // 3. 파일 조회 (Storage 경로 확인)
    const { data: files, error: selectError } = await supabase
      .from('product_files')
      .select('file_path')
      .eq('product_id', resolvedParams.id)
      .in('id', validated.file_ids);

    if (selectError) {
      console.error('File select error:', selectError);
      return NextResponse.json(
        {
          error: {
            code: 'SELECT_ERROR',
            message: selectError.message,
          },
        },
        { status: 500 }
      );
    }

    // 4. Storage에서 파일 삭제
    if (files && files.length > 0) {
      const storagePaths = files.map((f) => f.file_path);
      const { error: storageError } = await supabase.storage
        .from('product-files')
        .remove(storagePaths);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Storage 삭제 실패해도 DB는 삭제 (에러 로깅만)
      }
    }

    // 5. DB에서 파일 메타데이터 삭제
    const { error } = await supabase
      .from('product_files')
      .delete()
      .eq('product_id', resolvedParams.id)
      .in('id', validated.file_ids);

    if (error) {
      console.error('File delete error:', error);
      return NextResponse.json(
        {
          error: {
            code: 'DELETE_ERROR',
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        message: '파일이 삭제되었습니다.',
        deleted_count: validated.file_ids.length,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '입력값이 올바르지 않습니다.',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
