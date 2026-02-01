/**
 * NextAuth.js (Auth.js v5) Configuration
 *
 * - Credentials Provider (이메일/비밀번호)
 * - Google OAuth Provider
 * - Kakao OAuth Provider
 * - Supabase DB에서 사용자 조회
 * - OAuth 로그인 시 자동 회원가입
 * - 세션에 role 추가
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client (서버 사이드에서만 사용)
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Credentials Provider (이메일/비밀번호)
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

    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Kakao OAuth Provider
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth 로그인 시 자동으로 profiles 생성/업데이트
      if (account && (account.provider === 'google' || account.provider === 'kakao')) {
        const email = user.email;
        if (!email) {
          return false;
        }

        // 기존 프로필 조회
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

        if (existingProfile) {
          // 기존 사용자: 차단 여부 확인 및 last_login_at 업데이트
          if (existingProfile.is_blocked) {
            return false;
          }

          await supabaseAdmin
            .from('profiles')
            .update({
              last_login_at: new Date().toISOString(),
              // OAuth 제공자 정보 업데이트 (선택사항)
              ...(account.provider === 'google' && { google_id: account.providerAccountId }),
              ...(account.provider === 'kakao' && { kakao_id: account.providerAccountId }),
            })
            .eq('id', existingProfile.id);

          // 사용자 ID를 user 객체에 추가
          user.id = existingProfile.id;
          user.role = existingProfile.role;
        } else {
          // 신규 사용자: profiles 생성
          const { data: newProfile, error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({
              email: email,
              nickname: user.name || email.split('@')[0],
              avatar_url: user.image,
              role: 'customer',
              // OAuth 제공자 정보 저장
              ...(account.provider === 'google' && { google_id: account.providerAccountId }),
              ...(account.provider === 'kakao' && { kakao_id: account.providerAccountId }),
              last_login_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError || !newProfile) {
            console.error('Profile creation failed:', insertError);
            return false;
          }

          // 사용자 ID를 user 객체에 추가
          user.id = newProfile.id;
          user.role = newProfile.role;
        }
      }

      return true;
    },
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
