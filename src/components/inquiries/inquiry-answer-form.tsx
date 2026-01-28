/**
 * Inquiry Answer Form Component
 *
 * 관리자용 문의 답변 폼 - Neo-Brutalism 스타일
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2 } from 'lucide-react';

interface InquiryAnswerFormProps {
  inquiryId: string;
  existingAnswer?: string | null;
}

export function InquiryAnswerForm({ inquiryId, existingAnswer }: InquiryAnswerFormProps) {
  const router = useRouter();
  const [answer, setAnswer] = useState(existingAnswer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answer.trim()) {
      setError('답변 내용을 입력해주세요.');
      return;
    }

    if (answer.trim().length < 10) {
      setError('답변은 10자 이상 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/inquiries/${inquiryId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answer.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || '답변 등록에 실패했습니다.');
      }

      // 성공 시 페이지 새로고침
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '답변 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t-3 border-neo-black bg-neo-pink/10 p-6">
      <h2 className="text-lg font-black text-neo-black uppercase mb-4 flex items-center gap-2">
        <Send className="h-5 w-5" strokeWidth={2.5} />
        {existingAnswer ? '답변 수정' : '답변 작성'}
      </h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="고객 문의에 대한 답변을 작성해주세요..."
          rows={6}
          disabled={isSubmitting}
          className="
            w-full p-4
            bg-neo-white
            border-3 border-neo-black
            shadow-neo-sm
            font-medium text-neo-black
            placeholder:text-neo-black/40
            focus:outline-none focus:shadow-neo
            disabled:opacity-50
            resize-none
          "
        />

        {error && (
          <p className="mt-2 text-sm font-bold text-[#FF3333]">{error}</p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              px-6 py-3
              bg-neo-pink
              text-white
              border-3 border-neo-black
              shadow-neo
              font-bold uppercase tracking-wide
              flex items-center gap-2

              hover:translate-x-[2px] hover:translate-y-[2px]
              hover:shadow-neo-sm

              active:translate-x-[4px] active:translate-y-[4px]
              active:shadow-none

              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:translate-x-0 disabled:hover:translate-y-0
              disabled:hover:shadow-neo

              transition-all duration-150
            "
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.5} />
                처리 중...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" strokeWidth={2.5} />
                {existingAnswer ? '답변 수정' : '답변 등록'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
