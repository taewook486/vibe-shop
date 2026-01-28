import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "./providers";

// 본문용 폰트
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// 제목용 폰트 (Neo-Brutalism)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vibe Store - 디지털 상품 쇼핑몰",
  description: "라이브 코딩으로 만드는 디지털 상품 쇼핑몰 스캘레톤",
  keywords: ["디지털상품", "쇼핑몰", "템플릿", "Next.js", "Supabase"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-neo-white text-neo-black`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
