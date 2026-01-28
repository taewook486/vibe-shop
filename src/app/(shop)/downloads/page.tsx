/**
 * Downloads Page Redirect
 * /downloads -> /my/downloads 리다이렉트
 */

import { redirect } from 'next/navigation';

export default function DownloadsPage() {
  redirect('/my/downloads');
}
