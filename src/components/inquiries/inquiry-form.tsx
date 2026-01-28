/**
 * Inquiry Form Component - Neo-Brutalism 디자인
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Lock, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  CreateInquirySchema,
  type CreateInquiryInput,
  INQUIRY_CATEGORIES,
} from '@/types/inquiry';

interface InquiryFormProps {
  productId?: string;
  productName?: string;
  onSuccess?: (inquiryId: string) => void;
  onCancel?: () => void;
}

export function InquiryForm({
  productId,
  productName,
  onSuccess,
  onCancel,
}: InquiryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateInquiryInput>({
    resolver: zodResolver(CreateInquirySchema),
    defaultValues: {
      product_id: productId || undefined,
      category: 'product',
      title: '',
      content: '',
      is_private: false,
    },
  });

  const isPrivate = watch('is_private');
  const category = watch('category');

  async function onSubmit(values: CreateInquiryInput) {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || '문의 작성에 실패했습니다.');
      }

      toast({
        title: '문의가 등록되었습니다',
        description: '빠른 시일 내에 답변드리겠습니다.',
      });

      if (onSuccess) {
        onSuccess(data.inquiry.id);
      } else {
        router.push(`/inquiries/${data.inquiry.id}`);
      }
    } catch (error) {
      console.error('Inquiry submission error:', error);
      toast({
        title: '문의 등록 실패',
        description:
          error instanceof Error ? error.message : '문의 등록에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 상품 정보 (있는 경우) */}
      {productName && (
        <div className="p-4 bg-neo-cream border-3 border-neo-black">
          <p className="text-sm text-neo-black/60 font-bold">문의 상품</p>
          <p className="font-black text-neo-black">{productName}</p>
        </div>
      )}

      {/* 카테고리 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase text-neo-black">
          문의 유형
        </label>
        <div className="relative">
          <select
            {...register('category')}
            className="w-full px-4 py-3 bg-neo-white border-3 border-neo-black font-bold text-neo-black appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-neo-blue"
            disabled={isSubmitting}
          >
            {Object.entries(INQUIRY_CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neo-black pointer-events-none" strokeWidth={2.5} />
        </div>
        <p className="text-sm text-neo-black/60">문의 내용에 맞는 유형을 선택해주세요.</p>
        {errors.category && (
          <p className="text-sm font-bold text-neo-pink">{errors.category.message}</p>
        )}
      </div>

      {/* 제목 */}
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase text-neo-black">
          제목
        </label>
        <input
          type="text"
          {...register('title')}
          placeholder="문의 제목을 입력하세요"
          className="w-full px-4 py-3 bg-neo-white border-3 border-neo-black font-medium text-neo-black placeholder:text-neo-black/40 focus:outline-none focus:ring-2 focus:ring-neo-blue"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm font-bold text-neo-pink">{errors.title.message}</p>
        )}
      </div>

      {/* 내용 */}
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase text-neo-black">
          내용
        </label>
        <textarea
          {...register('content')}
          placeholder="문의 내용을 상세히 입력해주세요 (최소 10자)"
          rows={8}
          className="w-full px-4 py-3 bg-neo-white border-3 border-neo-black font-medium text-neo-black placeholder:text-neo-black/40 resize-none focus:outline-none focus:ring-2 focus:ring-neo-blue"
          disabled={isSubmitting}
        />
        <p className="text-sm text-neo-black/60">
          문의 내용을 자세히 작성하시면 더 정확한 답변을 받으실 수 있습니다.
        </p>
        {errors.content && (
          <p className="text-sm font-bold text-neo-pink">{errors.content.message}</p>
        )}
      </div>

      {/* 비밀글 옵션 */}
      <label className="flex items-start gap-4 p-4 bg-neo-cream border-3 border-neo-black cursor-pointer hover:bg-neo-yellow/30 transition-colors">
        <input
          type="checkbox"
          {...register('is_private')}
          className="w-6 h-6 mt-0.5 border-3 border-neo-black appearance-none cursor-pointer checked:bg-neo-blue checked:border-neo-blue"
          disabled={isSubmitting}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 font-black text-neo-black">
            <Lock className="w-5 h-5" strokeWidth={2.5} />
            비밀글로 작성
          </div>
          <p className="text-sm text-neo-black/60 mt-1">
            비밀글로 설정하면 작성자와 관리자만 내용을 볼 수 있습니다.
          </p>
        </div>
      </label>

      {/* Submit Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 bg-neo-white text-neo-black border-3 border-neo-black shadow-neo font-bold uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-neo-blue text-white border-3 border-neo-black shadow-neo font-bold uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
          {isSubmitting ? '등록 중...' : '문의 등록'}
        </button>
      </div>
    </form>
  );
}
