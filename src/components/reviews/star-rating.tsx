'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showLabel?: boolean;
  className?: string;
}

const RATING_LABELS = {
  1: '매우 불만족',
  2: '불만족',
  3: '보통',
  4: '만족',
  5: '매우 만족',
} as const;

const SIZE_CLASSES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

/**
 * StarRating 컴포넌트
 *
 * 별점을 표시하거나 입력받는 컴포넌트입니다.
 *
 * @example
 * // 읽기 전용 별점 표시
 * <StarRating rating={4.5} />
 *
 * @example
 * // 인터랙티브 별점 입력
 * <StarRating
 *   rating={rating}
 *   interactive
 *   onChange={setRating}
 *   showLabel
 * />
 */
export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showLabel = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const displayRating = hoverRating ?? rating;
  const currentLabel = showLabel ? RATING_LABELS[Math.round(displayRating) as keyof typeof RATING_LABELS] : null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayRating;
          const isPartiallyFilled = starValue > displayRating && starValue - 1 < displayRating;
          const fillPercentage = isPartiallyFilled ? ((displayRating % 1) * 100) : 100;

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
              aria-label={`별점 ${starValue}점`}
              className={cn(
                'relative transition-transform',
                interactive && 'cursor-pointer hover:scale-110',
                !interactive && 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  SIZE_CLASSES[size],
                  'text-gray-300 transition-colors'
                )}
                fill="currentColor"
              />

              {(isFilled || isPartiallyFilled) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: isPartiallyFilled ? `${fillPercentage}%` : '100%',
                  }}
                >
                  <Star
                    className={cn(
                      SIZE_CLASSES[size],
                      'text-yellow-400',
                      interactive && hoverRating && 'text-yellow-500'
                    )}
                    fill="currentColor"
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 별점 숫자 표시 */}
      {!interactive && (
        <span className="text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}

      {/* 레이블 표시 (인터랙티브 모드) */}
      {interactive && showLabel && currentLabel && (
        <span className="text-sm font-medium text-gray-600">
          {currentLabel}
        </span>
      )}
    </div>
  );
}

/**
 * RatingDistribution 컴포넌트
 *
 * 별점 분포를 시각적으로 표시하는 컴포넌트입니다.
 */
interface RatingDistributionProps {
  distribution: Record<string, number>;
  totalCount: number;
  onFilterByRating?: (rating: number) => void;
}

export function RatingDistribution({
  distribution,
  totalCount,
  onFilterByRating,
}: RatingDistributionProps) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating.toString()] || 0;
        const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => onFilterByRating?.(rating)}
            className={cn(
              'w-full flex items-center gap-3 text-sm transition-colors',
              onFilterByRating && 'hover:bg-gray-50 rounded p-1 -m-1'
            )}
            disabled={!onFilterByRating}
          >
            <div className="flex items-center gap-1 w-12">
              <span className="font-medium text-gray-700">{rating}점</span>
            </div>

            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <span className="w-12 text-right text-gray-600">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
