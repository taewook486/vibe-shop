/**
 * @file src/app/demo/phase-6/t6-9-comments/page.tsx
 * @description 댓글 컴포넌트 데모 페이지
 * @author frontend-specialist
 * @date 2026-01-25
 */

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommentList from '@/components/comments/comment-list';
import type { CommentWithAuthor } from '@/types/comment';

// Mock data
const mockUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'test@example.com',
  nickname: 'Test User',
  avatar_url: null,
  role: 'user' as const,
};

const mockAdmin = {
  id: '00000000-0000-0000-0000-000000000002',
  email: 'admin@example.com',
  nickname: 'Admin',
  avatar_url: null,
  role: 'admin' as const,
};

const emptyComments: CommentWithAuthor[] = [];

const commentsWithContent: CommentWithAuthor[] = [
  {
    id: '00000000-0000-0000-0000-000000000003',
    commentable_type: 'review',
    commentable_id: 'review-1',
    parent_id: null,
    user_id: mockUser.id,
    content: '정말 유용한 상품이네요! 추천합니다.',
    like_count: 5,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    author: mockUser,
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    commentable_type: 'review',
    commentable_id: 'review-1',
    parent_id: null,
    user_id: mockAdmin.id,
    content: '구매해주셔서 감사합니다! 더 좋은 상품으로 보답하겠습니다.',
    like_count: 2,
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    author: mockAdmin,
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    commentable_type: 'review',
    commentable_id: 'review-1',
    parent_id: null,
    user_id: '00000000-0000-0000-0000-000000000006',
    content: '배송이 빠르고 상품 상태도 좋았어요',
    like_count: 8,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    author: {
      id: '00000000-0000-0000-0000-000000000006',
      email: 'user2@example.com',
      nickname: '행복한구매자',
      avatar_url: null,
      role: 'user',
    },
  },
];

const commentsWithReplies: CommentWithAuthor[] = [
  {
    id: '00000000-0000-0000-0000-000000000007',
    commentable_type: 'review',
    commentable_id: 'review-1',
    parent_id: null,
    user_id: mockUser.id,
    content: '이 상품 정말 좋아요! 강력 추천합니다!',
    like_count: 12,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    author: mockUser,
  },
  {
    id: '00000000-0000-0000-0000-000000000008',
    commentable_type: 'review',
    commentable_id: 'review-1',
    parent_id: '00000000-0000-0000-0000-000000000007',
    user_id: '00000000-0000-0000-0000-000000000009',
    content: '저도 같은 생각이에요! 다음에 또 구매할 예정입니다.',
    like_count: 3,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    author: {
      id: '00000000-0000-0000-0000-000000000009',
      email: 'user3@example.com',
      nickname: '만족한고객',
      avatar_url: null,
      role: 'user',
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000010',
    commentable_type: 'review',
    commentable_id: 'review-1',
    parent_id: '00000000-0000-0000-0000-000000000007',
    user_id: mockAdmin.id,
    content: '좋은 후기 감사합니다! 항상 최선을 다하겠습니다.',
    like_count: 1,
    created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    author: mockAdmin,
  },
  {
    id: '00000000-0000-0000-0000-000000000011',
    commentable_type: 'review',
    commentable_id: 'review-1',
    parent_id: null,
    user_id: '00000000-0000-0000-0000-000000000012',
    content: '품질이 정말 좋네요',
    like_count: 4,
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    author: {
      id: '00000000-0000-0000-0000-000000000012',
      email: 'user4@example.com',
      nickname: '재구매의향100',
      avatar_url: null,
      role: 'user',
    },
  },
];

const editingStateComments: CommentWithAuthor[] = [
  {
    id: '00000000-0000-0000-0000-000000000013',
    commentable_type: 'review',
    commentable_id: 'review-1',
    parent_id: null,
    user_id: mockUser.id,
    content: '이 댓글은 수정할 수 있습니다 (본인 댓글)',
    like_count: 0,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago (edited)
    author: mockUser,
  },
  {
    id: '00000000-0000-0000-0000-000000000014',
    commentable_type: 'review',
    commentable_id: 'review-1',
    parent_id: null,
    user_id: '00000000-0000-0000-0000-000000000015',
    content: '[삭제된 댓글입니다]',
    like_count: 0,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    author: {
      id: '00000000-0000-0000-0000-000000000015',
      email: 'deleted@example.com',
      nickname: '삭제된사용자',
      avatar_url: null,
      role: 'user',
    },
  },
];

export default function CommentsDemo() {
  const [currentTab, setCurrentTab] = useState('empty');

  const getDemoData = () => {
    switch (currentTab) {
      case 'empty':
        return emptyComments;
      case 'with-comments':
        return commentsWithContent;
      case 'with-replies':
        return commentsWithReplies;
      case 'editing':
        return editingStateComments;
      default:
        return emptyComments;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">댓글 컴포넌트 데모</h1>
        <p className="text-gray-600">
          댓글 목록, 대댓글, 작성/수정 폼 기능 시연
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="empty">빈 상태</TabsTrigger>
          <TabsTrigger value="with-comments">댓글 있음</TabsTrigger>
          <TabsTrigger value="with-replies">대댓글 포함</TabsTrigger>
          <TabsTrigger value="editing">수정/삭제</TabsTrigger>
        </TabsList>

        {/* Empty State */}
        <TabsContent value="empty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>빈 댓글 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentList
                commentableType="review"
                commentableId="review-1"
                comments={getDemoData()}
                currentUserId={mockUser.id}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>설명</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                • 댓글이 없을 때 빈 상태 메시지 표시
              </p>
              <p className="text-sm text-gray-600">
                • 첫 댓글 작성 유도 문구
              </p>
              <p className="text-sm text-gray-600">
                • 로그인한 사용자는 댓글 작성 폼 표시
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* With Comments */}
        <TabsContent value="with-comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>댓글 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentList
                commentableType="review"
                commentableId="review-1"
                comments={getDemoData()}
                currentUserId={mockUser.id}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>주요 기능</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                • 댓글 개수 표시
              </p>
              <p className="text-sm text-gray-600">
                • 작성자 프로필 (닉네임, 아바타)
              </p>
              <p className="text-sm text-gray-600">
                • 작성 시간 (상대 시간)
              </p>
              <p className="text-sm text-gray-600">
                • 좋아요 버튼 및 카운트
              </p>
              <p className="text-sm text-gray-600">
                • 관리자 배지 표시
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* With Replies */}
        <TabsContent value="with-replies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>대댓글 포함</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentList
                commentableType="review"
                commentableId="review-1"
                comments={getDemoData()}
                currentUserId={mockUser.id}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>대댓글 기능</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                • 답글 버튼 클릭 시 답글 작성 폼 표시
              </p>
              <p className="text-sm text-gray-600">
                • 대댓글 들여쓰기 (왼쪽 보더)
              </p>
              <p className="text-sm text-gray-600">
                • 답글 접기/펼치기 기능
              </p>
              <p className="text-sm text-gray-600">
                • 답글 개수 표시
              </p>
              <p className="text-sm text-gray-600">
                • 1단계 대댓글만 허용
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Editing State */}
        <TabsContent value="editing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>수정 및 삭제</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentList
                commentableType="review"
                commentableId="review-1"
                comments={getDemoData()}
                currentUserId={mockUser.id}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>수정/삭제 기능</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                • 본인 댓글에만 수정/삭제 버튼 표시
              </p>
              <p className="text-sm text-gray-600">
                • 수정 버튼 클릭 시 인라인 수정 폼
              </p>
              <p className="text-sm text-gray-600">
                • 삭제 확인 다이얼로그
              </p>
              <p className="text-sm text-gray-600">
                • 대댓글 있는 경우 &ldquo;[삭제된 댓글입니다]&rdquo; 표시
              </p>
              <p className="text-sm text-gray-600">
                • 수정된 댓글에 &ldquo;(수정됨)&rdquo; 표시
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Technical Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>기술 사양</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-semibold mb-2">컴포넌트 구조</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>CommentList: 댓글 목록 컨테이너 (트리 구조, 상태 관리)</li>
              <li>CommentItem: 개별 댓글 렌더링 (좋아요, 수정, 삭제)</li>
              <li>CommentForm: 댓글 작성/수정 폼 (검증, 글자 수 제한)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">주요 기능</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>낙관적 업데이트 (좋아요, 댓글 추가/수정/삭제)</li>
              <li>대댓글 1단계 제한</li>
              <li>대댓글 접기/펼치기 (토글)</li>
              <li>삭제된 댓글 처리 (대댓글 있으면 표시만)</li>
              <li>글자 수 제한 (1000자)</li>
              <li>상대 시간 표시 (date-fns)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">API 엔드포인트</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>GET /api/comments - 댓글 목록 조회</li>
              <li>POST /api/comments - 댓글 작성</li>
              <li>PATCH /api/comments/[id] - 댓글 수정</li>
              <li>DELETE /api/comments/[id] - 댓글 삭제</li>
              <li>POST /api/likes - 좋아요 토글</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
