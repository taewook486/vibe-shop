/**
 * Legacy Login Page Redirect
 *
 * This page redirects to the new NextAuth-based login page at /auth/login
 */

import { redirect } from 'next/navigation';

export default async function LegacyLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const redirectParam = params.redirect || params.callbackUrl || '/';

  // Redirect to the new NextAuth login page
  redirect(`/auth/login?callbackUrl=${encodeURIComponent(redirectParam)}`);
}
