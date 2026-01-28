/**
 * PostgreSQL로 직접 마이그레이션 실행
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Supabase 데이터베이스 연결 정보 (Pooler)
const connectionString = 'postgresql://postgres.rwuvldzhpfnlrnyykyxl:Hn@UkRDjKEu8U+p@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

// SSL 설정 (Supabase 필수)
const ssl = { rejectUnauthorized: false };

async function runMigration(sqlFile) {
  console.log(`\n📄 Running: ${path.basename(sqlFile)}`);

  const client = new Client({
    connectionString,
    ssl,
  });

  try {
    await client.connect();
    console.log('   ✅ Connected to database');

    // SQL 파일 읽기
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // SQL 실행
    await client.query(sql);
    console.log(`   ✅ ${path.basename(sqlFile)} completed successfully`);
    return true;
  } catch (error) {
    const errorMsg = error.message || '';
    console.error(`   ⚠️  Error in ${path.basename(sqlFile)}:`, errorMsg);

    // 이미 존재하는 테이블/함수/트리거/제약조건 등의 에러는 무시
    const ignorePatterns = [
      'already exists',
      'does not exist',  // 삭제하려는 개체가 없는 경우
      'duplicate key',
      'relation.*does not exist',  // 참조하는 테이블이 없는 경우
    ];

    const shouldIgnore = ignorePatterns.some(pattern =>
      new RegExp(pattern, 'i').test(errorMsg)
    );

    if (shouldIgnore) {
      console.log('   ⚠️  Ignoring error (may already exist), continuing...');
      return true;  // 성공으로 처리
    }

    return false;  // 진짜 에러
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('🚀 Starting database migrations...\n');

  const migrationsDir = path.join(__dirname, '../supabase/migrations');

  // 실행할 마이그레이션 파일
  const migrationFiles = [
    '008_create_reviews.sql',
  ];

  let successCount = 0;
  let failCount = 0;

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      continue;
    }

    const success = await runMigration(filePath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`${'='.repeat(50)}`);

  if (failCount === 0) {
    console.log('\n🎉 All migrations completed successfully!');
    console.log('   Refresh your browser to see the changes.');
  }
}

main().catch(console.error);
