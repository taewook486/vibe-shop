/**
 * @file src/app/api/comments/[id]/route.ts
 * @description 댓글 수정 및 삭제 API
 * @author backend-specialist
 * @date 2026-01-25
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * PATCH /api/comments/[id]
 * 댓글 수정 (본인만 가능)
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    // 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    // 댓글 존재 및 소유권 확인
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingComment) {
      return NextResponse.json({ error: '댓글을 찾을 수 없습니다' }, { status: 404 });
    }

    // 본인 확인
    if (existingComment.user_id !== user.id) {
      // 관리자 권한 확인
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
      }
    }

    const body = await request.json();
    const { content } = body;

    // 내용 검증
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: '댓글 내용을 입력하세요' }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: '댓글은 1000자 이하로 입력하세요' }, { status: 400 });
    }

    // 댓글 수정
    const { data: updatedComment, error: updateError } = await supabase
      .from('comments')
      .update({ content: content.trim() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating comment:', updateError);
      return NextResponse.json({ error: '댓글 수정 실패' }, { status: 500 });
    }

    // 프로필 정보 포함
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .eq('id', updatedComment.user_id)
      .single();

    return NextResponse.json({
      comment: {
        ...updatedComment,
        user: profile || { id: user.id, display_name: 'Unknown User', avatar_url: null },
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}

/**
 * DELETE /api/comments/[id]
 * 댓글 삭제 (본인/관리자만 가능)
 * - 대댓글이 없으면 물리적 삭제
 * - 대댓글이 있으면 "[삭제된 댓글입니다]"로 표시 (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    // 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    // 댓글 존재 및 소유권 확인
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id, content')
      .eq('id', id)
      .single();

    if (fetchError || !existingComment) {
      return NextResponse.json({ error: '댓글을 찾을 수 없습니다' }, { status: 404 });
    }

    // 본인 확인
    let isAdmin = false;
    if (existingComment.user_id !== user.id) {
      // 관리자 권한 확인
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
      }
      isAdmin = true;
    }

    // 대댓글 존재 확인
    const { data: replies, error: repliesError } = await supabase
      .from('comments')
      .select('id')
      .eq('parent_id', id);

    if (repliesError) {
      console.error('Error checking replies:', repliesError);
      return NextResponse.json({ error: '댓글 삭제 실패' }, { status: 500 });
    }

    // 대댓글이 있는 경우: soft delete
    if (replies && replies.length > 0) {
      // DB에 is_deleted 컬럼 추가 필요
      // 임시로 content를 변경하는 방식 사용
      const { data: deletedComment, error: softDeleteError } = await supabase
        .from('comments')
        .update({
          content: '[삭제된 댓글입니다]',
          // is_deleted: true // 마이그레이션에 컬럼 추가 후 활성화
        })
        .eq('id', id)
        .select()
        .single();

      if (softDeleteError) {
        console.error('Error soft deleting comment:', softDeleteError);
        return NextResponse.json({ error: '댓글 삭제 실패' }, { status: 500 });
      }

      return NextResponse.json({
        message: '댓글이 삭제되었습니다',
        comment: {
          ...deletedComment,
          is_deleted: true,
        },
      });
    }

    // 대댓글이 없는 경우: 물리적 삭제
    const { error: deleteError } = await supabase.from('comments').delete().eq('id', id);

    if (deleteError) {
      console.error('Error deleting comment:', deleteError);
      return NextResponse.json({ error: '댓글 삭제 실패' }, { status: 500 });
    }

    return NextResponse.json({
      message: '댓글이 완전히 삭제되었습니다',
      id,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}
