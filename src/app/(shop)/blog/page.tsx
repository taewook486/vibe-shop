import Image from 'next/image';
import Link from 'next/link';

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

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-neo-white">
      {/* Hero Section */}
      <section className="border-b-3 border-neo-black bg-neo-cream">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <h1 className="text-5xl md:text-6xl font-black text-neo-black mb-4">
            VIBE BLOG
          </h1>
          <p className="text-xl text-neo-black/70 max-w-2xl">
            디지털 크리에이터를 위한 인사이트와 팁을 공유합니다.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-neo-white border-3 border-neo-black shadow-neo overflow-hidden hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-sm transition-all h-full flex flex-col">
                {/* Thumbnail */}
                <div className="relative aspect-video border-b-3 border-neo-black">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-sm text-neo-black/60 mb-3">
                    <span>{post.author}</span>
                    <span>•</span>
                    <time>{post.date}</time>
                  </div>

                  <h2 className="text-xl font-bold text-neo-black mb-3 group-hover:text-neo-blue transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-neo-black/70 mb-4 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-neo-blue font-bold text-sm">
                    <span>더 읽기</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
