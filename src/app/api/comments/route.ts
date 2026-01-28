/**
 * @file src/app/api/comments/route.ts
 * @description 댓글/대댓글 API - 목록 조회 및 작성
 * @author backend-specialist
 * @date 2026-01-25
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/comments
 * 댓글 목록 조회 (대댓글 포함, 트리 구조)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const commentable_type = searchParams.get('commentable_type');
    const commentable_id = searchParams.get('commentable_id');

    // 필수 파라미터 검증
    if (!commentable_type || !commentable_id) {
      return NextResponse.json(
        { error: 'commentable_type과 commentable_id는 필수입니다' },
        { status: 400 }
      );
    }

    // 타입 검증
    if (!['review', 'inquiry'].includes(commentable_type)) {
      return NextResponse.json(
        { error: 'commentable_type은 review 또는 inquiry만 가능합니다' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 댓글 트리 조회 (DB 함수 사용)
    const { data: comments, error } = await supabase.rpc('get_comment_tree', {
      p_commentable_type: commentable_type as 'review' | 'inquiry',
      p_commentable_id: commentable_id,
    });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ error: '댓글 조회 실패' }, { status: 500 });
    }

    // 사용자 프로필 정보 포함
    const userIds = [...new Set(comments?.map((c: any) => c.user_id) || [])];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url')
      .in('id', userIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

    // 댓글에 프로필 정보 추가
    const commentsWithProfiles = comments?.map((comment: any) => ({
      ...comment,
      user: profileMap.get(comment.user_id) || {
        id: comment.user_id,
        nickname: 'Unknown User',
        avatar_url: null,
      },
    }));

    return NextResponse.json({
      comments: commentsWithProfiles || [],
      total: comments?.length || 0,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}

/**
 * POST /api/comments
 * 댓글/대댓글 작성
 */
export async function POST(request: NextRequest) {
  try {
    // NextAuth 세션 확인
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const body = await request.json();
    const { commentable_type, commentable_id, parent_id, content } = body;

    // 필수 필드 검증
    if (!commentable_type || !commentable_id || !content) {
      return NextResponse.json(
        { error: 'commentable_type, commentable_id, content는 필수입니다' },
        { status: 400 }
      );
    }

    // 타입 검증
    if (!['review', 'inquiry'].includes(commentable_type)) {
      return NextResponse.json(
        { error: 'commentable_type은 review 또는 inquiry만 가능합니다' },
        { status: 400 }
      );
    }

    // 내용 길이 검증
    if (content.trim().length === 0) {
      return NextResponse.json({ error: '댓글 내용을 입력하세요' }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: '댓글은 1000자 이하로 입력하세요' }, { status: 400 });
    }

    // 대댓글인 경우, 부모 댓글이 이미 대댓글이 아닌지 확인 (1단계만 허용)
    if (parent_id) {
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('parent_id')
        .eq('id', parent_id)
        .single();

      if (parentError || !parentComment) {
        return NextResponse.json({ error: '부모 댓글을 찾을 수 없습니다' }, { status: 404 });
      }

      if (parentComment.parent_id !== null) {
        return NextResponse.json(
          { error: '대댓글은 1단계까지만 작성할 수 있습니다' },
          { status: 400 }
        );
      }
    }

    // 댓글 작성
    const { data: comment, error: insertError } = await supabase
      .from('comments')
      .insert({
        commentable_type,
        commentable_id,
        parent_id: parent_id || null,
        user_id: userId,
        content: content.trim(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting comment:', insertError);
      return NextResponse.json({ error: '댓글 작성 실패' }, { status: 500 });
    }

    // 프로필 정보 포함
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url')
      .eq('id', userId)
      .single();

    return NextResponse.json(
      {
        comment: {
          ...comment,
          user: profile || { id: userId, nickname: 'Unknown User', avatar_url: null },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}
