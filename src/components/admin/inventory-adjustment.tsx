/**
 * P7-T7.11: 재고 조정 컴포넌트
 *
 * 기능:
 * - 재고 추가/차감
 * - 사유 입력
 * - 변경 이력 조회
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import InventoryHistory from './inventory-history';
import { Package, TrendingUp, TrendingDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  stock: number;
  stock_alert_threshold: number;
}

interface InventoryAdjustmentProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const adjustmentSchema = z.object({
  quantity: z.number().int().refine((val) => val !== 0, {
    message: '수량은 0이 아니어야 합니다',
  }),
  reason: z.string().min(1, '사유를 입력해주세요').max(500, '사유는 500자 이하여야 합니다'),
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

export default function InventoryAdjustment({
  product,
  isOpen,
  onClose,
  onSuccess,
}: InventoryAdjustmentProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStock, setCurrentStock] = useState(product.stock);

  const form = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      quantity: currentStock,
      reason: '',
    },
  });

  // product가 변경되면 현재 재고 업데이트
  useEffect(() => {
    setCurrentStock(product.stock);
    form.reset({
      quantity: product.stock,
      reason: '',
    });
  }, [product, form]);

  // 재고 조정 제출
  const onSubmit = async (data: AdjustmentFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: data.quantity,
          reason: data.reason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '재고 조정 실패');
      }

      toast({
        title: '재고 조정 완료',
        description: `${product.name}의 재고가 ${data.quantity}개로 조정되었습니다.`,
      });

      onSuccess();
    } catch (error) {
      console.error('재고 조정 오류:', error);
      toast({
        title: '재고 조정 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 빠른 조정 (추가/차감)
  const handleQuickAdjust = (delta: number) => {
    const newQuantity = Math.max(0, currentStock + delta);
    form.setValue('quantity', newQuantity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>재고 조정 - {product.name}</DialogTitle>
          <DialogDescription>
            상품의 재고를 조정하고 변경 이력을 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="adjust" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adjust">재고 조정</TabsTrigger>
            <TabsTrigger value="history">변경 이력</TabsTrigger>
          </TabsList>

          <TabsContent value="adjust" className="space-y-4">
            {/* 현재 재고 표시 */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">현재 재고</span>
              </div>
              <div className="text-2xl font-bold">{currentStock}개</div>
            </div>

            {/* 빠른 조정 버튼 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">빠른 조정</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjust(-10)}
                >
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -10
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjust(-5)}
                >
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -5
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjust(-1)}
                >
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -1
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjust(1)}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +1
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjust(5)}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjust(10)}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +10
                </Button>
              </div>
            </div>

            {/* 재고 조정 폼 */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>새로운 재고 수량</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        현재 재고: {currentStock}개 → 변경 후:{' '}
                        {form.watch('quantity')}개
                        {form.watch('quantity') !== currentStock && (
                          <span className="ml-2 font-medium">
                            (
                            {form.watch('quantity') > currentStock ? '+' : ''}
                            {form.watch('quantity') - currentStock}개)
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>조정 사유</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="재고 조정 사유를 입력하세요 (예: 입고, 재고 실사, 파손 등)"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    취소
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '처리 중...' : '재고 조정'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="history">
            <InventoryHistory productId={product.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
