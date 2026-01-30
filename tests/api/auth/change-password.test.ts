/**
 * Change Password API Tests
 *
 * NextAuth 세션 기반 비밀번호 변경 API 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/change-password/route';
import type { Session } from 'next-auth';

// Mock dependencies
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

// Helper to create a mock session
function createMockSession(overrides?: Partial<Session>): Session {
  return {
    user: {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      image: null,
      role: 'customer',
    },
    expires: new Date(Date.now() + 3600000).toISOString(),
    ...overrides,
  } as Session;
}

vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: vi.fn(),
}));

import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';

describe('POST /api/auth/change-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    // Mock: No session
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null as Session | null);

    const request = new Request('http://localhost:3000/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword: 'newpassword123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('인증이 필요합니다');
  });

  it('should return 400 if password is too short', async () => {
    // Mock: Valid session
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(createMockSession());

    const request = new Request('http://localhost:3000/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword: '123' }), // Too short
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('비밀번호는 최소 6자 이상이어야 합니다');
  });

  it('should successfully change password', async () => {
    // Mock: Valid session
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(createMockSession());

    // Mock: Supabase admin client
    const mockUpdateUserById = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createAdminClient).mockReturnValue({
      auth: {
        admin: {
          updateUserById: mockUpdateUserById,
        },
      },
    } as any);

    const request = new Request('http://localhost:3000/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword: 'newpassword123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockUpdateUserById).toHaveBeenCalledWith('user-123', {
      password: 'newpassword123',
    });
  });

  it('should return 500 if Supabase update fails', async () => {
    // Mock: Valid session
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(createMockSession());

    // Mock: Supabase error
    const mockUpdateUserById = vi.fn().mockResolvedValue({
      error: { message: 'Database error' },
    });
    vi.mocked(createAdminClient).mockReturnValue({
      auth: {
        admin: {
          updateUserById: mockUpdateUserById,
        },
      },
    } as any);

    const request = new Request('http://localhost:3000/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword: 'newpassword123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('비밀번호 변경에 실패했습니다');
  });
});
