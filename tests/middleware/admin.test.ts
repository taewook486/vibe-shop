/**
 * 관리자 권한 미들웨어 테스트
 *
 * P4-T4.1: Admin Middleware
 *
 * AC:
 * - role=admin 체크
 * - /admin/* 접근 제어
 * - 비관리자 접근 시 403
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAdminSession, isAdminUser } from '@/lib/middleware/admin';
import type { Session } from 'next-auth';

describe('Admin Middleware - 관리자 권한 체크', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isAdminSession', () => {
    it('session이 null이면 false를 반환해야 함', () => {
      expect(isAdminSession(null)).toBe(false);
    });

    it('session.user가 null이면 false를 반환해야 함', () => {
      const session = {} as Session;
      expect(isAdminSession(session)).toBe(false);
    });

    it('role이 customer면 false를 반환해야 함', () => {
      const session = {
        user: { id: 'user-123', email: 'user@example.com', name: 'User', image: null, role: 'customer' },
        expires: '2024-01-01',
      } as Session;
      expect(isAdminSession(session)).toBe(false);
    });

    it('role이 admin이면 true를 반환해야 함', () => {
      const session = {
        user: { id: 'admin-123', email: 'admin@example.com', name: 'Admin', image: null, role: 'admin' },
        expires: '2024-01-01',
      } as Session;
      expect(isAdminSession(session)).toBe(true);
    });
  });

  describe('isAdminUser', () => {
    it('null이면 false를 반환해야 함', async () => {
      const result = await isAdminUser(null);
      expect(result).toBe(false);
    });

    it('role이 customer면 false를 반환해야 함', async () => {
      const session = {
        user: { id: 'user-123', email: 'user@example.com', name: 'User', image: null, role: 'customer' },
        expires: '2024-01-01',
      } as Session;
      const result = await isAdminUser(session);
      expect(result).toBe(false);
    });

    it('role이 admin이면 true를 반환해야 함', async () => {
      const session = {
        user: { id: 'admin-123', email: 'admin@example.com', name: 'Admin', image: null, role: 'admin' },
        expires: '2024-01-01',
      } as Session;
      const result = await isAdminUser(session);
      expect(result).toBe(true);
    });
  });
});
