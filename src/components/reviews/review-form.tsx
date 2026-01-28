'use client';

import React from 'react';
import Image from 'next/image';
import { X, Upload, Loader2 } from 'lucide-react';
import { StarRating } from './star-rating';
import { CreateReviewInput } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  productId: string;
  orderItemId: string;
  onSubmit: (data: CreateReviewInput) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

const MAX_IMAGES = 5;
const MIN_CONTENT_LENGTH = 10;
const MAX_TITLE_LENGTH = 200;

/**
 * ReviewForm 컴포넌트
 *
 * 후기 작성 폼 컴포넌트입니다.
 *
 * @example
 * <ReviewForm
 *   productId={productId}
 *   orderItemId={orderItemId}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 */
export function ReviewForm({
  productId,
  orderItemId,
  onSubmit,
  onCancel,
  className,
}: ReviewFormProps) {
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [images, setImages] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 유효성 검증
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    } else if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `제목은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요`;
    }

    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요';
    } else if (content.length < MIN_CONTENT_LENGTH) {
      newErrors.content = `내용을 ${MIN_CONTENT_LENGTH}자 이상 입력해주세요`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      setErrors({
        ...errors,
        images: `이미지는 최대 ${MAX_IMAGES}장까지 업로드 가능합니다`,
      });
      return;
    }

    // 실제 구현에서는 파일을 서버에 업로드하고 URL을 받아야 합니다
    // 여기서는 임시로 FileReader를 사용하여 미리보기 생성
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setImages([...images, ...newImages]);
    setErrors({ ...errors, images: '' });

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        product_id: productId,
        order_item_id: orderItemId,
        rating,
        title: title.trim(),
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
      });

      // 폼 초기화
      setRating(5);
      setTitle('');
      setContent('');
      setImages([]);
      setErrors({});
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : '후기 등록에 실패했습니다',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('bg-white border border-gray-200 rounded-lg p-6 space-y-6', className)}
    >
      <h3 className="text-lg font-semibold text-gray-900">후기 작성</h3>

      {/* 별점 선택 */}
      <div className="space-y-2">
        <Label>별점</Label>
        <StarRating
          rating={rating}
          interactive
          onChange={setRating}
          showLabel
          size="lg"
        />
      </div>

      {/* 제목 */}
      <div className="space-y-2">
        <Label htmlFor="review-title">
          제목 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="review-title"
          type="text"
          placeholder="후기 제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          className={errors.title ? 'border-red-500' : ''}
        />
        <div className="flex justify-between items-center">
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {title.length}/{MAX_TITLE_LENGTH}
          </p>
        </div>
      </div>

      {/* 내용 */}
      <div className="space-y-2">
        <Label htmlFor="review-content">
          내용 <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="review-content"
          placeholder="구매하신 상품에 대한 솔직한 후기를 작성해주세요 (최소 10자 이상)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className={errors.content ? 'border-red-500' : ''}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      {/* 이미지 업로드 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>이미지 (선택, 최대 5장)</Label>
          <span className="text-sm text-gray-500">
            {images.length}/{MAX_IMAGES}
          </span>
        </div>

        {/* 이미지 미리보기 */}
        {images.length > 0 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
              >
                <Image
                  src={image}
                  alt={`업로드 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 업로드 버튼 */}
        {images.length < MAX_IMAGES && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="review-image-upload"
              aria-label="이미지 추가"
            />
            <label htmlFor="review-image-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                이미지 추가
              </Button>
            </label>
          </div>
        )}

        {errors.images && (
          <p className="text-sm text-red-500">{errors.images}</p>
        )}
      </div>

      {/* 제출 에러 */}
      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-3 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            취소
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              등록 중...
            </>
          ) : (
            '등록'
          )}
        </Button>
      </div>
    </form>
  );
}
