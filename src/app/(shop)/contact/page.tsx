/**
 * Contact Page Redirect
 * /contact -> /inquiries 리다이렉트
 */

import { redirect } from 'next/navigation';

export default function ContactPage() {
  redirect('/inquiries');
}
