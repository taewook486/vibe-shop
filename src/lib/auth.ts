/**
 * NextAuth.js (Auth.js v5) Configuration
 *
 * - Credentials Provider (이메일/비밀번호)
 * - Supabase DB에서 사용자 조회
 * - 세션에 role 추가
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client (서버 사이드에서만 사용)
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // 1. profiles 테이블에서 사용자 조회
        const { data: profile, error } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

        if (error || !profile) {
          return null;
        }

        // 2. 차단된 사용자 확인
        if (profile.is_blocked) {
          throw new Error('차단된 사용자입니다.');
        }

        // 3. 비밀번호 검증
        // Supabase Auth의 signInWithPassword를 사용하여 비밀번호 검증
        const { data: signInData, error: signInError } =
          await supabaseAdmin.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError || !signInData.user) {
          return null;
        }

        // 4. last_login_at 업데이트
        await supabaseAdmin
          .from('profiles')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', profile.id);

        // 5. 사용자 객체 반환
        return {
          id: profile.id,
          email: profile.email,
          name: profile.nickname || profile.email.split('@')[0],
          image: profile.avatar_url,
          role: profile.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 초기 로그인 시 user 정보를 token에 추가
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // token 정보를 session에 추가
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'customer' | 'admin';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
});
