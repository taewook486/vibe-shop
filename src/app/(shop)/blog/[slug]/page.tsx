import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';

const blogPosts = [
  {
    slug: 'welcome-to-vibe-store',
    title: 'Vibe Store에 오신 것을 환영합니다',
    excerpt: '디지털 크리에이터를 위한 새로운 마켓플레이스, Vibe Store를 소개합니다.',
    thumbnail: 'https://placehold.co/800x400/0066FF/FFFFFF?text=Welcome',
    author: 'Vibe Labs',
    date: '2026년 1월 20일',
    content: `
# Vibe Store에 오신 것을 환영합니다

안녕하세요! Vibe Store를 방문해주셔서 감사합니다.

## 우리가 만드는 것

Vibe Store는 디지털 크리에이터들이 자신의 작품을 판매할 수 있는 마켓플레이스입니다.

### 다양한 디지털 상품
- UI 키트
- 아이콘 팩
- 템플릿
- 폰트
- 그래픽 에셋

## 앞으로의 계획

더 많은 기능들이 추가될 예정입니다. 기대해주세요!
    `,
  },
  {
    slug: 'how-to-sell-digital-products',
    title: '디지털 상품 판매 시작하기',
    excerpt: 'Vibe Store에서 디지털 상품을 판매하는 방법을 알아보세요.',
    thumbnail: 'https://placehold.co/800x400/FF3366/FFFFFF?text=Sell',
    author: 'Vibe Labs',
    date: '2026년 1월 18일',
    content: `
# 디지털 상품 판매 시작하기

Vibe Store에서 크리에이터로 활동하는 방법을 알려드립니다.

## 1단계: 회원가입

먼저 Vibe Store에 회원가입을 해주세요.

## 2단계: 크리에이터 신청

마이페이지에서 크리에이터 신청을 할 수 있습니다.

## 3단계: 상품 등록

승인 후 상품을 등록할 수 있습니다.
    `,
  },
  {
    slug: 'design-trends-2026',
    title: '2026년 디자인 트렌드',
    excerpt: '올해 주목해야 할 디자인 트렌드를 소개합니다.',
    thumbnail: 'https://placehold.co/800x400/CCFF00/1A1A1A?text=Trends',
    author: 'Vibe Labs',
    date: '2026년 1월 15일',
    content: `
# 2026년 디자인 트렌드

새해를 맞아 주목해야 할 디자인 트렌드를 정리했습니다.

## Neo-Brutalism

대담한 색상과 굵은 테두리가 특징인 Neo-Brutalism 스타일이 인기입니다.

## 3D & Motion

3D 그래픽과 모션 디자인의 활용이 증가하고 있습니다.

## AI 기반 디자인

AI를 활용한 디자인 도구들이 빠르게 발전하고 있습니다.
    `,
  },
];

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neo-white">
      {/* Back Button */}
      <div className="border-b-3 border-neo-black bg-neo-cream">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-neo-black hover:text-neo-blue font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            <span>목록으로 돌아가기</span>
          </Link>
        </div>
      </div>

      {/* Header Image */}
      <div className="border-b-3 border-neo-black">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[21/9]">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
        {/* Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-neo-black/60 mb-4">
            <span className="font-bold text-neo-black">{post.author}</span>
            <span>•</span>
            <time>{post.date}</time>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-neo-black mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-neo-black/70">
            {post.excerpt}
          </p>
        </div>

        {/* Divider */}
        <div className="h-1 bg-neo-black mb-12" />

        {/* Markdown Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-black text-neo-black mt-12 mb-6 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold text-neo-black mt-10 mb-5">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-bold text-neo-black mt-8 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-neo-black/80 leading-relaxed mb-6">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-none space-y-3 mb-6 ml-0">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-3">
                  <span className="text-neo-blue font-bold mt-1">•</span>
                  <span className="text-neo-black/80">{children}</span>
                </li>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-3 mb-6 ml-4">
                  {children}
                </ol>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-neo-black">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-neo-black/90">
                  {children}
                </em>
              ),
              code: ({ children }) => (
                <code className="px-2 py-1 bg-neo-cream text-neo-black border-2 border-neo-black text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-neo-black text-neo-white p-6 border-3 border-neo-black shadow-neo overflow-x-auto mb-6">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-neo-blue bg-neo-cream/50 pl-6 py-4 my-6 italic">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-neo-blue font-bold underline hover:text-neo-pink transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Divider */}
        <div className="h-1 bg-neo-black my-12" />

        {/* Back Button (Bottom) */}
        <div className="flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neo-blue text-white border-3 border-neo-black shadow-neo font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            <span>블로그 목록으로</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
