'use client';

/**
 * ProductDetailPage
 *
 * 상품 상세 페이지
 * - slug 기반 라우팅
 * - 상품 정보 표시 (이름, 가격, 할인가, 설명)
 * - Markdown 설명 렌더링
 * - 이미지 갤러리
 * - 미리보기 파일 목록 (is_preview=true)
 * - 장바구니 담기 버튼
 * - 태그 표시
 * - Neo-Brutalism 스타일
 */

import { use } from 'react';
import { useProduct } from '@/hooks/use-products';
import { useCart } from '@/hooks/use-cart';
import { ImageGallery } from '@/components/products/image-gallery';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Download, FileText } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const { product, isLoading, error } = useProduct(slug);
  const { addItem } = useCart();

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg font-bold text-neo-black">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg font-bold text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg font-bold text-neo-black">상품을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercentage = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  // Filter preview files
  const previewFiles = product.files?.filter((file) => file.is_preview) || [];

  // Use images directly from API (already in correct format)
  // API returns: { id, product_id, url, alt, is_primary, sort_order, created_at }
  const productImages = (product.images || [])
    .filter((img) => img && img.url) // Filter out images without valid URL
    .map((img) => ({
      id: img.id || crypto.randomUUID(),
      product_id: img.product_id || product.id,
      url: img.url,
      alt: img.alt || product.name,
      sort_order: img.sort_order || 0,
      is_primary: img.is_primary || false,
      created_at: img.created_at || product.created_at,
    }));

  // Handle add to cart
  const handleAddToCart = () => {
    addItem(product.id);
  };

  // Format price
  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null) return '0원';
    return `${price.toLocaleString('ko-KR')}원`;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div>
          <ImageGallery images={productImages} />
        </div>

        {/* Right Column: Product Info */}
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-neo-black mb-2">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-lg text-neo-black/70">{product.short_description}</p>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-neo-cream border-2 border-neo-black text-sm font-bold"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="bg-neo-yellow border-3 border-neo-black shadow-neo p-6">
            {product.discount_price ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-neo-black line-through decoration-2">
                    {formatPrice(product.price)}
                  </span>
                  <span className="px-2 py-1 bg-neo-red text-neo-white text-sm font-black border-2 border-neo-black">
                    {discountPercentage}% OFF
                  </span>
                </div>
                <div className="text-4xl font-black text-neo-black">
                  {formatPrice(product.discount_price)}
                </div>
              </div>
            ) : (
              <div className="text-4xl font-black text-neo-black">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            size="lg"
            data-testid="add-to-cart-button"
            className="w-full h-14 text-lg font-black bg-neo-blue hover:bg-neo-blue/90 border-3 border-neo-black shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-all"
          >
            <ShoppingCart className="w-5 h-5 mr-2" strokeWidth={2.5} />
            장바구니 담기
          </Button>

          {/* Preview Files */}
          {previewFiles.length > 0 && (
            <div className="bg-neo-cream border-3 border-neo-black shadow-neo p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" strokeWidth={2.5} />
                <h3 className="text-lg font-black text-neo-black">미리보기 파일</h3>
              </div>
              <div className="space-y-3">
                {previewFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-neo-white border-2 border-neo-black"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-neo-black">{file.name}</p>
                      <p className="text-sm text-neo-black/60">
                        {formatFileSize(file.file_size)} · {file.file_type}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-neo-black/40" strokeWidth={2.5} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Description (Full Width) */}
      {product.description && (
        <div className="mt-12 bg-neo-white border-3 border-neo-black shadow-neo p-8">
          <h2 className="text-2xl font-black text-neo-black mb-6">상품 설명</h2>
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-neo-black prose-p:text-neo-black/80 prose-strong:text-neo-black prose-strong:font-bold prose-ul:text-neo-black/80 prose-ol:text-neo-black/80">
            <ReactMarkdown>{product.description}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
