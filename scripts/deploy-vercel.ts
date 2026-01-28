#!/usr/bin/env tsx

/**
 * Vercel 배포 자동화 스크립트
 *
 * 기능:
 * 1. Vercel CLI 설치 확인 및 안내
 * 2. 프로젝트 연결 확인
 * 3. 환경변수 설정 확인 및 안내
 * 4. 배포 실행
 *
 * 사용법:
 *   npm run deploy:vercel          # 프리뷰 배포
 *   npm run deploy:vercel -- --prod  # 프로덕션 배포
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// 환경변수 체크리스트
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL'
];

const OPTIONAL_ENV_VARS = [
  'TOSS_CLIENT_KEY',
  'TOSS_SECRET_KEY'
];

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step: number, message: string) {
  log(`\n[${step}/5] ${message}`, 'cyan');
  log('─'.repeat(60), 'cyan');
}

function execCommand(command: string, silent = false): string {
  try {
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return output;
  } catch (error: any) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

async function checkVercelCLI(): Promise<boolean> {
  logStep(1, 'Vercel CLI 확인');

  try {
    const version = execCommand('vercel --version', true).trim();
    log(`✓ Vercel CLI 설치됨 (v${version})`, 'green');
    return true;
  } catch {
    log('✗ Vercel CLI가 설치되지 않았습니다', 'red');
    log('\n다음 명령어로 설치하세요:', 'yellow');
    log('  npm install -g vercel', 'bold');
    log('\n또는:', 'yellow');
    log('  npx vercel --version  (매번 npx 사용)', 'bold');
    return false;
  }
}

async function checkProjectLink(): Promise<boolean> {
  logStep(2, '프로젝트 연결 확인');

  const vercelDir = join(process.cwd(), '.vercel');

  if (existsSync(vercelDir)) {
    log('✓ Vercel 프로젝트가 연결되어 있습니다', 'green');
    return true;
  }

  log('✗ Vercel 프로젝트가 연결되지 않았습니다', 'yellow');
  log('\n다음 명령어로 프로젝트를 연결하세요:', 'yellow');
  log('  vercel link', 'bold');
  log('\n처음 배포하는 경우:', 'yellow');
  log('  vercel  (자동으로 프로젝트 생성 및 연결)', 'bold');

  const response = await promptUser('\n지금 프로젝트를 연결하시겠습니까? (y/N): ');

  if (response.toLowerCase() === 'y') {
    try {
      execCommand('vercel link');
      return true;
    } catch (error) {
      log('프로젝트 연결 실패', 'red');
      return false;
    }
  }

  return false;
}

async function checkEnvironmentVariables(): Promise<{ missing: string[], optional: string[] }> {
  logStep(3, '환경변수 확인');

  const envPath = join(process.cwd(), '.env.local');
  const envVars: Record<string, string> = {};

  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
  }

  const missing: string[] = [];
  const optional: string[] = [];

  // 필수 환경변수 체크
  log('\n필수 환경변수:', 'bold');
  REQUIRED_ENV_VARS.forEach(varName => {
    if (envVars[varName] && envVars[varName] !== '') {
      log(`  ✓ ${varName}`, 'green');
    } else {
      log(`  ✗ ${varName} (누락)`, 'red');
      missing.push(varName);
    }
  });

  // 선택 환경변수 체크
  log('\n선택 환경변수:', 'bold');
  OPTIONAL_ENV_VARS.forEach(varName => {
    if (envVars[varName] && envVars[varName] !== '') {
      log(`  ✓ ${varName}`, 'green');
    } else {
      log(`  - ${varName} (미설정)`, 'yellow');
      optional.push(varName);
    }
  });

  return { missing, optional };
}

async function displayDeploymentGuide(missingVars: string[], optionalVars: string[]) {
  if (missingVars.length > 0) {
    log('\n⚠️  필수 환경변수가 누락되었습니다!', 'red');
    log('\nVercel 대시보드에서 환경변수를 설정하세요:', 'yellow');
    log('1. https://vercel.com/dashboard 접속', 'bold');
    log('2. 프로젝트 선택 > Settings > Environment Variables', 'bold');
    log('3. 다음 변수들을 추가:', 'bold');

    missingVars.forEach(varName => {
      log(`   - ${varName}`, 'yellow');
    });

    log('\n또는 CLI로 설정:', 'yellow');
    log('  vercel env add NEXT_PUBLIC_SUPABASE_URL', 'bold');
    log('  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY', 'bold');
    log('  vercel env add SUPABASE_SERVICE_ROLE_KEY', 'bold');
  }

  if (optionalVars.length > 0 && optionalVars.some(v => v.includes('TOSS'))) {
    log('\n💡 Toss Payments를 사용하려면:', 'cyan');
    log('  - TOSS_CLIENT_KEY', 'yellow');
    log('  - TOSS_SECRET_KEY', 'yellow');
    log('를 Vercel 환경변수에 추가하세요.', 'yellow');
  }
}

async function deployToVercel(isProd: boolean) {
  logStep(4, isProd ? '프로덕션 배포 시작' : '프리뷰 배포 시작');

  const deployCommand = isProd ? 'vercel --prod' : 'vercel';

  log(`\n실행 명령어: ${deployCommand}`, 'cyan');
  log('배포를 시작합니다...\n', 'bold');

  try {
    execCommand(deployCommand);
    return true;
  } catch (error) {
    log('\n✗ 배포 실패', 'red');
    return false;
  }
}

function displaySuccessMessage(isProd: boolean) {
  logStep(5, '배포 완료');

  log('\n✓ 배포가 성공적으로 완료되었습니다!', 'green');

  if (isProd) {
    log('\n프로덕션 URL:', 'bold');
    log('  배포된 URL을 확인하려면 Vercel 대시보드를 확인하세요.', 'cyan');
  } else {
    log('\n프리뷰 URL:', 'bold');
    log('  위 출력에서 Preview URL을 확인하세요.', 'cyan');
  }

  log('\n다음 단계:', 'bold');
  log('1. 배포된 사이트에 접속하여 동작 확인', 'yellow');
  log('2. Supabase 연결 확인', 'yellow');
  log('3. 결제 시스템 테스트 (Toss Payments)', 'yellow');
  log('4. 관리자 페이지 접근 확인 (/admin)', 'yellow');

  log('\n유용한 명령어:', 'bold');
  log('  vercel logs        - 배포 로그 확인', 'cyan');
  log('  vercel domains     - 도메인 설정', 'cyan');
  log('  vercel env ls      - 환경변수 목록', 'cyan');
}

function displayFailureMessage(step: string) {
  log(`\n✗ ${step}에서 문제가 발생했습니다`, 'red');

  log('\n문제 해결:', 'bold');
  log('1. Vercel CLI가 최신 버전인지 확인:', 'yellow');
  log('   npm install -g vercel@latest', 'cyan');

  log('\n2. Vercel 계정 로그인 확인:', 'yellow');
  log('   vercel login', 'cyan');

  log('\n3. 프로젝트 연결 재시도:', 'yellow');
  log('   rm -rf .vercel', 'cyan');
  log('   vercel link', 'cyan');

  log('\n4. 환경변수 확인:', 'yellow');
  log('   .env.local 파일 또는 Vercel 대시보드', 'cyan');

  log('\n자세한 도움말:', 'bold');
  log('  https://vercel.com/docs', 'cyan');
}

function promptUser(question: string): Promise<string> {
  return new Promise(resolve => {
    process.stdout.write(question);
    process.stdin.once('data', data => {
      resolve(data.toString().trim());
    });
  });
}

async function main() {
  console.clear();

  log('╔══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         Vibe Store - Vercel 배포 자동화 스크립트            ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════╝', 'cyan');

  const isProd = process.argv.includes('--prod');

  if (isProd) {
    log('\n🚀 프로덕션 배포 모드', 'green');
  } else {
    log('\n🔍 프리뷰 배포 모드', 'yellow');
    log('    (프로덕션 배포: npm run deploy:vercel -- --prod)', 'yellow');
  }

  try {
    // Step 1: Vercel CLI 확인
    const hasVercelCLI = await checkVercelCLI();
    if (!hasVercelCLI) {
      displayFailureMessage('Vercel CLI 확인');
      process.exit(1);
    }

    // Step 2: 프로젝트 연결 확인
    const isLinked = await checkProjectLink();
    if (!isLinked) {
      displayFailureMessage('프로젝트 연결');
      process.exit(1);
    }

    // Step 3: 환경변수 확인
    const { missing, optional } = await checkEnvironmentVariables();

    await displayDeploymentGuide(missing, optional);

    if (missing.length > 0) {
      log('\n⚠️  계속 진행하면 배포는 성공하지만 앱이 정상 작동하지 않을 수 있습니다.', 'red');
      const shouldContinue = await promptUser('\n계속 진행하시겠습니까? (y/N): ');

      if (shouldContinue.toLowerCase() !== 'y') {
        log('\n배포를 취소했습니다.', 'yellow');
        process.exit(0);
      }
    }

    // Step 4: 배포 실행
    const deploySuccess = await deployToVercel(isProd);

    if (!deploySuccess) {
      displayFailureMessage('배포 실행');
      process.exit(1);
    }

    // Step 5: 성공 메시지
    displaySuccessMessage(isProd);

  } catch (error: any) {
    log(`\n✗ 오류 발생: ${error.message}`, 'red');
    displayFailureMessage('실행 중');
    process.exit(1);
  }
}

// stdin을 raw 모드로 설정 (프롬프트용)
if (process.stdin.isTTY) {
  process.stdin.setRawMode(false);
}

main();
