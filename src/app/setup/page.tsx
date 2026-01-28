'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/setup/step-indicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Database,
  CreditCard,
  Store,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { number: 1, title: 'Supabase', description: '데이터베이스 연결' },
  { number: 2, title: '결제', description: '결제 설정' },
  { number: 3, title: '사이트', description: '기본 정보' },
  { number: 4, title: '완료', description: '초기화 실행' },
];

interface SetupFormData {
  // Step 1: Supabase
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;

  // Step 2: Toss Payments (Optional)
  tossClientKey: string;
  tossSecretKey: string;

  // Step 3: Site Info
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  logoUrl: string;
}

type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [connectionError, setConnectionError] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(false);

  const [formData, setFormData] = useState<SetupFormData>({
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseServiceKey: '',
    tossClientKey: '',
    tossSecretKey: '',
    siteName: 'Vibe Store',
    siteUrl: 'http://localhost:3000',
    adminEmail: '',
    logoUrl: '',
  });

  const updateFormData = (field: keyof SetupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Test Supabase connection
  const testConnection = async () => {
    setConnectionStatus('testing');
    setConnectionError('');

    try {
      const response = await fetch('/api/setup/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formData.supabaseUrl,
          anonKey: formData.supabaseAnonKey,
          serviceRoleKey: formData.supabaseServiceKey || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || '연결 테스트에 실패했습니다.');
      }

      setConnectionStatus('success');
    } catch (error) {
      setConnectionStatus('error');
      setConnectionError(
        error instanceof Error ? error.message : '연결 테스트에 실패했습니다.'
      );
    }
  };

  // Initialize database
  const initializeDatabase = async () => {
    setIsInitializing(true);

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabase: {
            url: formData.supabaseUrl,
            anonKey: formData.supabaseAnonKey,
            serviceRoleKey: formData.supabaseServiceKey || undefined,
          },
          toss: formData.tossClientKey
            ? {
                clientKey: formData.tossClientKey,
                secretKey: formData.tossSecretKey,
              }
            : undefined,
          site: {
            name: formData.siteName,
            url: formData.siteUrl,
            adminEmail: formData.adminEmail,
            logoUrl: formData.logoUrl || undefined,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || '설정 저장에 실패했습니다.');
      }

      // Redirect to admin
      router.push('/admin');
    } catch (error) {
      alert('초기화에 실패했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
      setIsInitializing(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return connectionStatus === 'success';
      case 2:
        return true; // Payment is optional
      case 3:
        return formData.siteName && formData.adminEmail;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceedToNextStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-12">
        <StepIndicator currentStep={currentStep} steps={STEPS} />
      </div>

      {/* Step Content */}
      <Card>
        {currentStep === 1 && (
          <>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6 text-vibe-blue" />
                <CardTitle>Supabase 데이터베이스 설정</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Supabase 프로젝트의 URL과 API 키를 입력하세요.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Supabase URL */}
              <div className="space-y-2">
                <Label htmlFor="supabaseUrl">
                  Supabase URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="supabaseUrl"
                  placeholder="https://xxxxx.supabase.co"
                  value={formData.supabaseUrl}
                  onChange={(e) => updateFormData('supabaseUrl', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Supabase 프로젝트 대시보드 Settings → API에서 확인
                </p>
              </div>

              {/* Supabase Anon Key */}
              <div className="space-y-2">
                <Label htmlFor="supabaseAnonKey">
                  Supabase Anon Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="supabaseAnonKey"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={formData.supabaseAnonKey}
                  onChange={(e) => updateFormData('supabaseAnonKey', e.target.value)}
                />
              </div>

              {/* Supabase Service Role Key */}
              <div className="space-y-2">
                <Label htmlFor="supabaseServiceKey">
                  Supabase Service Role Key <span className="text-gray-400">(선택)</span>
                </Label>
                <Input
                  id="supabaseServiceKey"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={formData.supabaseServiceKey}
                  onChange={(e) => updateFormData('supabaseServiceKey', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  관리자 기능 사용 시 필요 (RLS 우회)
                </p>
              </div>

              <Separator />

              {/* Connection Test */}
              <div className="space-y-4">
                <Button
                  onClick={testConnection}
                  disabled={connectionStatus === 'testing' || !formData.supabaseUrl || !formData.supabaseAnonKey}
                  className="w-full"
                >
                  {connectionStatus === 'testing' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      연결 테스트 중...
                    </>
                  ) : (
                    '연결 테스트'
                  )}
                </Button>

                {/* Connection Status */}
                {connectionStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">연결 성공! 다음 단계로 진행하세요.</span>
                  </div>
                )}

                {connectionStatus === 'error' && (
                  <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">연결 실패</p>
                      <p className="text-xs mt-1">{connectionError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Help Link */}
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-900 mb-2">
                  Supabase 프로젝트가 없으신가요?
                </p>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Supabase 대시보드에서 프로젝트 생성하기
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-vibe-blue" />
                <CardTitle>결제 설정 (선택사항)</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Toss Payments 결제를 사용하려면 API 키를 입력하세요.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Toss Client Key */}
              <div className="space-y-2">
                <Label htmlFor="tossClientKey">
                  Toss Payments Client Key <span className="text-gray-400">(선택)</span>
                </Label>
                <Input
                  id="tossClientKey"
                  placeholder="test_ck_..."
                  value={formData.tossClientKey}
                  onChange={(e) => updateFormData('tossClientKey', e.target.value)}
                />
              </div>

              {/* Toss Secret Key */}
              <div className="space-y-2">
                <Label htmlFor="tossSecretKey">
                  Toss Payments Secret Key <span className="text-gray-400">(선택)</span>
                </Label>
                <Input
                  id="tossSecretKey"
                  type="password"
                  placeholder="test_sk_..."
                  value={formData.tossSecretKey}
                  onChange={(e) => updateFormData('tossSecretKey', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  결제 승인 및 웹훅 처리에 사용
                </p>
              </div>

              <Separator />

              {/* Info */}
              <div className="bg-amber-50 p-4 rounded-md">
                <p className="text-sm text-amber-900 mb-2">
                  나중에 설정할 수 있습니다
                </p>
                <p className="text-xs text-amber-700">
                  결제 기능을 바로 사용하지 않는다면 이 단계를 건너뛰고 나중에 환경 변수를 수정할 수 있습니다.
                </p>
              </div>

              {/* Help Link */}
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-900 mb-2">
                  Toss Payments 계정이 없으신가요?
                </p>
                <a
                  href="https://www.tosspayments.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Toss Payments 가입하기
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Store className="h-6 w-6 text-vibe-blue" />
                <CardTitle>사이트 기본 정보</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                쇼핑몰 운영에 필요한 기본 정보를 입력하세요.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Site Name */}
              <div className="space-y-2">
                <Label htmlFor="siteName">
                  상점명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="siteName"
                  placeholder="Vibe Store"
                  value={formData.siteName}
                  onChange={(e) => updateFormData('siteName', e.target.value)}
                />
              </div>

              {/* Site URL */}
              <div className="space-y-2">
                <Label htmlFor="siteUrl">사이트 URL</Label>
                <Input
                  id="siteUrl"
                  placeholder="https://yourstore.com"
                  value={formData.siteUrl}
                  onChange={(e) => updateFormData('siteUrl', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  배포 후 실제 도메인으로 변경하세요
                </p>
              </div>

              {/* Admin Email */}
              <div className="space-y-2">
                <Label htmlFor="adminEmail">
                  관리자 이메일 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.adminEmail}
                  onChange={(e) => updateFormData('adminEmail', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  알림 및 시스템 메일 수신 주소
                </p>
              </div>

              {/* Logo URL (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="logoUrl">
                  로고 URL <span className="text-gray-400">(선택)</span>
                </Label>
                <Input
                  id="logoUrl"
                  placeholder="https://example.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => updateFormData('logoUrl', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  나중에 관리자 페이지에서 업로드할 수 있습니다
                </p>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 4 && (
          <>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-vibe-blue" />
                <CardTitle>설정 완료 및 DB 초기화</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                모든 설정이 완료되었습니다. 데이터베이스를 초기화하고 쇼핑몰을 시작하세요.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Configuration Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">설정 요약</h3>

                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium">Supabase URL</span>
                    <span className="text-sm text-gray-600 truncate max-w-xs">
                      {formData.supabaseUrl}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium">Toss Payments</span>
                    <span className={cn(
                      "text-sm",
                      formData.tossClientKey ? "text-green-600" : "text-gray-400"
                    )}>
                      {formData.tossClientKey ? '설정됨' : '미설정'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium">상점명</span>
                    <span className="text-sm text-gray-600">{formData.siteName}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium">관리자 이메일</span>
                    <span className="text-sm text-gray-600">{formData.adminEmail}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* What will happen */}
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  초기화 시 수행되는 작업
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>환경 변수 저장 (.env.local)</li>
                  <li>사이트 설정 파일 생성 (config/site.config.ts)</li>
                  <li>데이터베이스 마이그레이션 실행</li>
                  <li>초기 시드 데이터 삽입 (샘플 카테고리, 상품)</li>
                </ul>
              </div>

              {/* Initialize Button */}
              <Button
                onClick={initializeDatabase}
                disabled={isInitializing}
                className="w-full"
                size="lg"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    초기화 중... (최대 1분 소요)
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    초기화 시작하기
                  </>
                )}
              </Button>

              {isInitializing && (
                <div className="bg-amber-50 p-4 rounded-md">
                  <p className="text-sm text-amber-900">
                    초기화가 진행 중입니다. 잠시만 기다려주세요...
                  </p>
                </div>
              )}
            </CardContent>
          </>
        )}

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="border-t px-6 py-4">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                이전
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceedToNextStep()}
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
