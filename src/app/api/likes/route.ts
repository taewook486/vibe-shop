/**
 * @file src/app/api/likes/route.ts
 * @description 좋아요 API (다형성 지원: reviews, comments)
 * @author task-executor (backend-specialist)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * GET /api/likes - 좋아요 상태 확인
 *
 * Query Parameters:
 * - likeable_type: 'review' | 'comment'
 * - likeable_id: UUID
 * - user_id: UUID
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     liked: boolean,
 *     like_count: number
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);

    const likeable_type = searchParams.get('likeable_type');
    const likeable_id = searchParams.get('likeable_id');
    const user_id = searchParams.get('user_id');

    // 파라미터 검증
    if (!likeable_type || !likeable_id || !user_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: likeable_type, likeable_id, user_id',
        },
        { status: 400 }
      );
    }

    // likeable_type 검증
    if (!['review', 'comment'].includes(likeable_type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid likeable_type. Must be review or comment',
        },
        { status: 400 }
      );
    }

    // 좋아요 상태 확인 (check_user_liked 함수 사용)
    const { data: liked, error: likeError } = await supabase.rpc('check_user_liked', {
      p_likeable_type: likeable_type as 'review' | 'comment',
      p_likeable_id: likeable_id,
      p_user_id: user_id,
    });

    if (likeError) {
      console.error('Like check error:', likeError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to check like status',
        },
        { status: 500 }
      );
    }

    // 전체 좋아요 수 조회
    const { count: like_count, error: countError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('likeable_type', likeable_type as 'review' | 'comment')
      .eq('likeable_id', likeable_id);

    if (countError) {
      console.error('Like count error:', countError);
    }

    return NextResponse.json({
      success: true,
      data: {
        liked: liked || false,
        like_count: like_count || 0,
      },
    });
  } catch (error) {
    console.error('GET /api/likes error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/likes - 좋아요 토글 (추가/취소)
 *
 * Body:
 * {
 *   likeable_type: 'review' | 'comment',
 *   likeable_id: UUID,
 *   user_id: UUID
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     action: 'liked' | 'unliked',
 *     like_id: UUID,
 *     like_count: number
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();

    const { likeable_type, likeable_id, user_id } = body;

    // 파라미터 검증
    if (!likeable_type || !likeable_id || !user_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: likeable_type, likeable_id, user_id',
        },
        { status: 400 }
      );
    }

    // likeable_type 검증
    if (!['review', 'comment'].includes(likeable_type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid likeable_type. Must be review or comment',
        },
        { status: 400 }
      );
    }

    // 좋아요 토글 (toggle_like 함수 사용)
    const { data: result, error: toggleError } = await supabase.rpc('toggle_like', {
      p_likeable_type: likeable_type as 'review' | 'comment',
      p_likeable_id: likeable_id,
      p_user_id: user_id,
    });

    if (toggleError) {
      console.error('Toggle like error:', toggleError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to toggle like',
        },
        { status: 500 }
      );
    }

    // 현재 좋아요 수 조회
    const { count: like_count, error: countError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('likeable_type', likeable_type as 'review' | 'comment')
      .eq('likeable_id', likeable_id);

    if (countError) {
      console.error('Like count error:', countError);
    }

    return NextResponse.json({
      success: true,
      data: {
        action: result.action,
        like_id: result.like_id,
        like_count: like_count || 0,
      },
    });
  } catch (error) {
    console.error('POST /api/likes error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
