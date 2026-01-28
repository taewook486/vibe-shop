'use client';

import { useState } from 'react';
import { StepIndicator } from '@/components/setup/step-indicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Database,
  CreditCard,
  Store,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { number: 1, title: 'Supabase', description: '데이터베이스 연결' },
  { number: 2, title: '결제', description: '결제 설정' },
  { number: 3, title: '사이트', description: '기본 정보' },
  { number: 4, title: '완료', description: '초기화 실행' },
];

type DemoState =
  | 'step-1'
  | 'step-2'
  | 'step-3'
  | 'step-4'
  | 'complete'
  | 'already-configured';

export default function SetupWizardDemo() {
  const [demoState, setDemoState] = useState<DemoState>('step-1');

  // Demo form data
  const mockFormData = {
    supabaseUrl: 'https://xxxxx.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    supabaseServiceKey: '',
    tossClientKey: 'test_ck_...',
    tossSecretKey: 'test_sk_...',
    siteName: 'Vibe Store',
    siteUrl: 'http://localhost:3000',
    adminEmail: 'admin@vibestore.com',
    logoUrl: '',
  };

  const getCurrentStep = () => {
    switch (demoState) {
      case 'step-1':
        return 1;
      case 'step-2':
        return 2;
      case 'step-3':
        return 3;
      case 'step-4':
        return 4;
      case 'complete':
        return 5;
      default:
        return 1;
    }
  };

  const renderAlreadyConfigured = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-6 w-6 text-amber-600" />
          <CardTitle>이미 설정이 완료되었습니다</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Vibe Store가 이미 설정되어 있습니다. 설정을 변경하려면 관리자 페이지에서 수정하거나,
          환경 변수 파일을 직접 편집하세요.
        </p>

        <div className="bg-amber-50 p-4 rounded-md">
          <p className="text-sm text-amber-900 mb-2 font-medium">설정 파일 위치</p>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>.env.local (환경 변수)</li>
            <li>config/site.config.ts (사이트 설정)</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">관리자 페이지로 이동</Button>
          <Button variant="outline" className="flex-1">
            홈으로 이동
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep1 = () => (
    <Card>
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
        <div className="space-y-2">
          <Label htmlFor="supabaseUrl">
            Supabase URL <span className="text-red-500">*</span>
          </Label>
          <Input
            id="supabaseUrl"
            placeholder="https://xxxxx.supabase.co"
            defaultValue={mockFormData.supabaseUrl}
          />
          <p className="text-xs text-gray-500">
            Supabase 프로젝트 대시보드 Settings → API에서 확인
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabaseAnonKey">
            Supabase Anon Key <span className="text-red-500">*</span>
          </Label>
          <Input
            id="supabaseAnonKey"
            type="password"
            defaultValue={mockFormData.supabaseAnonKey}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabaseServiceKey">
            Supabase Service Role Key <span className="text-gray-400">(선택)</span>
          </Label>
          <Input id="supabaseServiceKey" type="password" />
          <p className="text-xs text-gray-500">관리자 기능 사용 시 필요 (RLS 우회)</p>
        </div>

        <Separator />

        <div className="space-y-4">
          <Button className="w-full">연결 테스트</Button>

          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">연결 성공! 다음 단계로 진행하세요.</span>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-900 mb-2">Supabase 프로젝트가 없으신가요?</p>
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

      <div className="border-t px-6 py-4">
        <div className="flex justify-between">
          <Button variant="outline" disabled>
            이전
          </Button>
          <Button onClick={() => setDemoState('step-2')}>다음</Button>
        </div>
      </div>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
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
        <div className="space-y-2">
          <Label htmlFor="tossClientKey">
            Toss Payments Client Key <span className="text-gray-400">(선택)</span>
          </Label>
          <Input id="tossClientKey" placeholder="test_ck_..." defaultValue={mockFormData.tossClientKey} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tossSecretKey">
            Toss Payments Secret Key <span className="text-gray-400">(선택)</span>
          </Label>
          <Input id="tossSecretKey" type="password" placeholder="test_sk_..." defaultValue={mockFormData.tossSecretKey} />
          <p className="text-xs text-gray-500">결제 승인 및 웹훅 처리에 사용</p>
        </div>

        <Separator />

        <div className="bg-amber-50 p-4 rounded-md">
          <p className="text-sm text-amber-900 mb-2">나중에 설정할 수 있습니다</p>
          <p className="text-xs text-amber-700">
            결제 기능을 바로 사용하지 않는다면 이 단계를 건너뛰고 나중에 환경 변수를 수정할 수 있습니다.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-900 mb-2">Toss Payments 계정이 없으신가요?</p>
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

      <div className="border-t px-6 py-4">
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setDemoState('step-1')}>
            이전
          </Button>
          <Button onClick={() => setDemoState('step-3')}>다음</Button>
        </div>
      </div>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
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
        <div className="space-y-2">
          <Label htmlFor="siteName">
            상점명 <span className="text-red-500">*</span>
          </Label>
          <Input id="siteName" placeholder="Vibe Store" defaultValue={mockFormData.siteName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteUrl">사이트 URL</Label>
          <Input
            id="siteUrl"
            placeholder="https://yourstore.com"
            defaultValue={mockFormData.siteUrl}
          />
          <p className="text-xs text-gray-500">배포 후 실제 도메인으로 변경하세요</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminEmail">
            관리자 이메일 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="adminEmail"
            type="email"
            placeholder="admin@example.com"
            defaultValue={mockFormData.adminEmail}
          />
          <p className="text-xs text-gray-500">알림 및 시스템 메일 수신 주소</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">
            로고 URL <span className="text-gray-400">(선택)</span>
          </Label>
          <Input id="logoUrl" placeholder="https://example.com/logo.png" />
          <p className="text-xs text-gray-500">
            나중에 관리자 페이지에서 업로드할 수 있습니다
          </p>
        </div>
      </CardContent>

      <div className="border-t px-6 py-4">
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setDemoState('step-2')}>
            이전
          </Button>
          <Button onClick={() => setDemoState('step-4')}>다음</Button>
        </div>
      </div>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
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
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">설정 요약</h3>

          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium">Supabase URL</span>
              <span className="text-sm text-gray-600 truncate max-w-xs">
                {mockFormData.supabaseUrl}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium">Toss Payments</span>
              <span className="text-sm text-green-600">설정됨</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium">상점명</span>
              <span className="text-sm text-gray-600">{mockFormData.siteName}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium">관리자 이메일</span>
              <span className="text-sm text-gray-600">{mockFormData.adminEmail}</span>
            </div>
          </div>
        </div>

        <Separator />

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

        <Button onClick={() => setDemoState('complete')} className="w-full" size="lg">
          <CheckCircle className="h-5 w-5 mr-2" />
          초기화 시작하기
        </Button>
      </CardContent>

      <div className="border-t px-6 py-4">
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setDemoState('step-3')}>
            이전
          </Button>
          <Button disabled>다음</Button>
        </div>
      </div>
    </Card>
  );

  const renderComplete = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 text-vibe-blue animate-spin" />
          <CardTitle>초기화 진행 중...</CardTitle>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          데이터베이스를 설정하고 있습니다. 잠시만 기다려주세요.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm">환경 변수 저장 완료</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm">사이트 설정 파일 생성 완료</span>
          </div>
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-vibe-blue animate-spin" />
            <span className="text-sm">데이터베이스 마이그레이션 실행 중...</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            <span className="text-sm text-gray-400">초기 시드 데이터 삽입 대기 중</span>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-md">
          <p className="text-sm text-amber-900">
            초기화가 진행 중입니다. 최대 1분 정도 소요될 수 있습니다...
          </p>
        </div>

        <div className="text-center py-4">
          <Loader2 className="h-12 w-12 text-vibe-blue animate-spin mx-auto" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-vibe-blue/5 via-vibe-violet/5 to-vibe-amber/5 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Demo Controls */}
        <Card className="mb-8 border-2 border-vibe-blue">
          <CardHeader>
            <CardTitle>Demo: Setup Wizard Web UI (P5-T5.3)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                초기 설정 위저드 - 단계별 폼 UI로 Supabase, 결제, 사이트 정보를 설정합니다.
              </p>
              <Tabs value={demoState} onValueChange={(v) => setDemoState(v as DemoState)}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="step-1">Step 1</TabsTrigger>
                  <TabsTrigger value="step-2">Step 2</TabsTrigger>
                  <TabsTrigger value="step-3">Step 3</TabsTrigger>
                  <TabsTrigger value="step-4">Step 4</TabsTrigger>
                  <TabsTrigger value="complete">Complete</TabsTrigger>
                  <TabsTrigger value="already-configured">Configured</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="text-sm space-y-2 text-muted-foreground">
                <p>
                  <strong>Step 1:</strong> Supabase 설정 (URL, ANON_KEY 입력, 연결 테스트)
                </p>
                <p>
                  <strong>Step 2:</strong> 결제 설정 (Toss 키, 선택사항)
                </p>
                <p>
                  <strong>Step 3:</strong> 사이트 정보 (상점명, 로고, 관리자)
                </p>
                <p>
                  <strong>Step 4:</strong> 완료 및 DB 초기화 실행
                </p>
                <p>
                  <strong>Complete:</strong> 초기화 진행 중 (로딩 상태)
                </p>
                <p>
                  <strong>Configured:</strong> 이미 설정된 경우 접근 차단
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wizard Content */}
        <div className="max-w-4xl mx-auto">
          {demoState !== 'already-configured' && demoState !== 'complete' && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Vibe Store 초기 설정
                </h1>
                <p className="text-gray-600">쇼핑몰 운영에 필요한 기본 설정을 진행합니다</p>
              </div>

              <div className="mb-12">
                <StepIndicator currentStep={getCurrentStep()} steps={STEPS} />
              </div>
            </>
          )}

          {demoState === 'step-1' && renderStep1()}
          {demoState === 'step-2' && renderStep2()}
          {demoState === 'step-3' && renderStep3()}
          {demoState === 'step-4' && renderStep4()}
          {demoState === 'complete' && renderComplete()}
          {demoState === 'already-configured' && renderAlreadyConfigured()}
        </div>
      </div>
    </div>
  );
}
