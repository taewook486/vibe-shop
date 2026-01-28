/**
 * 마이그레이션 실행 스크립트
 * Supabase 데이터베이스에 SQL 마이그레이션을 실행합니다
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 환경 변수
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

// Supabase Admin 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * RPC로 SQL 쿼리 실행 (postgres 패키지 필요 없이)
 * 참고: Supabase 클라이언트는 직접 SQL 실행을 지원하지 않으므로,
 * 대신 SQL 파일을 읽어서 사용자에게 안내하거나 별도 방법 사용
 */
async function executeSQL(sql) {
  // Supabase REST API로 직접 SQL 실행
  // postgres 확장이 필요할 수 있음
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL execution failed: ${error}`);
  }

  return await response.json();
}

/**
 * 마이그레이션 파일 실행
 */
async function runMigration(filePath) {
  console.log(`\n📄 Running: ${path.basename(filePath)}`);

  const sql = fs.readFileSync(filePath, 'utf8');

  try {
    // SQL을 여러 문장으로 분리 (간단 구현)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements`);

    // 각 문장 실행 (주의: 복잡한 SQL은 실패할 수 있음)
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.length < 10) continue; // 너무 짧은 문장 스킵

      try {
        await executeSQL(stmt);
      } catch (error) {
        // 일부 에러는 무시 (이미 존재하는 등)
        if (error.message.includes('already exists')) {
          console.log(`   ⚠️  Statement ${i + 1}: ${error.message}`);
        } else {
          throw error;
        }
      }
    }

    console.log(`   ✅ ${path.basename(filePath)} completed`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error in ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🚀 Starting database migrations...\n');

  const migrationsDir = path.join(__dirname, '../supabase/migrations');

  // 마이그레이션 파일 목록 (순서대로)
  const migrationFiles = [
    '001_create_profiles.sql',
    '002_create_categories.sql',
    '003_create_products.sql',
    '004_create_product_images.sql',
    '005_create_product_files_tags.sql',
    '006_create_orders.sql',
    '007_create_rls_policies.sql',
    '008_create_reviews.sql',
    '009_create_inquiries.sql', // ← 이것이 우리가 필요한 것!
    '010_create_comments_likes.sql',
    '011_extend_profiles.sql',
    '012_create_coupons.sql',
    '013_create_inventory.sql',
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

  if (failCount > 0) {
    console.log('\n⚠️  Some migrations failed. Please check the errors above.');
    console.log('💡 Alternatively, run the SQL files manually in Supabase Dashboard > SQL Editor');
  } else {
    console.log('\n🎉 All migrations completed successfully!');
  }
}

main().catch(console.error);
