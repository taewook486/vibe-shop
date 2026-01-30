import { ImageGallery } from '@/components/products/image-gallery';
import type { ProductImage } from '@/types/product';

// Demo data
const singleImageData: ProductImage[] = [
  {
    id: '1',
    product_id: 'demo-product-1',
    url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=800&fit=crop',
    alt: 'Modern workspace with laptop',
    sort_order: 0,
    is_primary: true,
    created_at: '2024-01-01T00:00:00Z',
  },
];

const multipleImagesData: ProductImage[] = [
  {
    id: '1',
    product_id: 'demo-product-2',
    url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=800&fit=crop',
    alt: 'Modern workspace with laptop',
    sort_order: 0,
    is_primary: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    product_id: 'demo-product-2',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop',
    alt: 'Developer coding on computer',
    sort_order: 1,
    is_primary: false,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    product_id: 'demo-product-2',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=800&fit=crop',
    alt: 'Team collaboration',
    sort_order: 2,
    is_primary: false,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    product_id: 'demo-product-2',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop',
    alt: 'Creative brainstorming',
    sort_order: 3,
    is_primary: false,
    created_at: '2024-01-01T00:00:00Z',
  },
];

const emptyImagesData: ProductImage[] = [];

export default function ImageGalleryDemoPage() {
  return (
    <div className="min-h-screen bg-neo-white p-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tight text-neo-black">
            Image Gallery Demo
          </h1>
          <p className="text-lg text-neo-black/70 max-w-2xl mx-auto">
            T2.5: Multi-image gallery with thumbnails and zoom functionality
          </p>
        </div>

        {/* Demo States */}
        <div className="space-y-12">
          {/* Single Image State */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-neo-lime text-neo-black border-2 border-neo-black text-sm font-bold uppercase">
                State 1
              </div>
              <h2 className="text-2xl font-bold text-neo-black">Single Image</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-neo-cream border-3 border-neo-black shadow-neo p-6">
                <ImageGallery images={singleImageData} />
              </div>
              <div className="bg-neo-cream border-3 border-neo-black shadow-neo p-6">
                <h3 className="text-lg font-bold mb-3">Expected Behavior:</h3>
                <ul className="space-y-2 text-sm text-neo-black/80">
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Main image displayed prominently</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>No thumbnail list (only 1 image)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Click to zoom in/out with indicator</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Neo-Brutalism styling (thick borders, hard shadow)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Multiple Images State */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-neo-blue text-white border-2 border-neo-black text-sm font-bold uppercase">
                State 2
              </div>
              <h2 className="text-2xl font-bold text-neo-black">Multiple Images</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-neo-cream border-3 border-neo-black shadow-neo p-6">
                <ImageGallery images={multipleImagesData} />
              </div>
              <div className="bg-neo-cream border-3 border-neo-black shadow-neo p-6">
                <h3 className="text-lg font-bold mb-3">Expected Behavior:</h3>
                <ul className="space-y-2 text-sm text-neo-black/80">
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Thumbnails displayed below main image</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Click thumbnail to change main image</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Active thumbnail highlighted with blue ring</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Thumbnails scroll horizontally on mobile</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Zoom resets when changing images</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Zoom Functionality State */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-neo-pink text-white border-2 border-neo-black text-sm font-bold uppercase">
                State 3
              </div>
              <h2 className="text-2xl font-bold text-neo-black">Zoom Feature</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-neo-cream border-3 border-neo-black shadow-neo p-6">
                <ImageGallery images={multipleImagesData} />
                <div className="mt-4 p-4 bg-neo-yellow border-2 border-neo-black">
                  <p className="text-sm font-bold text-neo-black">
                    👆 Click the main image to zoom in/out
                  </p>
                </div>
              </div>
              <div className="bg-neo-cream border-3 border-neo-black shadow-neo p-6">
                <h3 className="text-lg font-bold mb-3">Zoom Controls:</h3>
                <ul className="space-y-2 text-sm text-neo-black/80">
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Zoom in icon (magnifying glass +) when not zoomed</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Zoom out icon (magnifying glass -) when zoomed</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Cursor changes: zoom-in → zoom-out</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Smooth transition (300ms)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>1.5x scale when zoomed</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Empty State */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-neo-purple text-white border-2 border-neo-black text-sm font-bold uppercase">
                State 4
              </div>
              <h2 className="text-2xl font-bold text-neo-black">Empty State</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-neo-cream border-3 border-neo-black shadow-neo p-6">
                <ImageGallery images={emptyImagesData} />
              </div>
              <div className="bg-neo-cream border-3 border-neo-black shadow-neo p-6">
                <h3 className="text-lg font-bold mb-3">Expected Behavior:</h3>
                <ul className="space-y-2 text-sm text-neo-black/80">
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Placeholder message displayed</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>Maintains aspect ratio and styling</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neo-blue font-bold">✓</span>
                    <span>No errors or broken layout</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center p-6 bg-neo-cream border-3 border-neo-black shadow-neo">
          <p className="text-sm font-bold text-neo-black/70">
            Task P2-T2.5: Image Gallery Component
          </p>
          <p className="text-xs text-neo-black/50 mt-2">
            Neo-Brutalism Design System • Responsive • Accessible
          </p>
        </div>
      </div>
    </div>
  );
}
