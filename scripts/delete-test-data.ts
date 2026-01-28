/**
 * Delete Test Data Script
 *
 * "user test"로 시작하는 카테고리와 상품 삭제
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
  },
});

async function deleteTestData() {
  console.log('🗑️  Deleting test data...\n');

  // Delete products first (due to foreign key constraint)
  console.log('📦 Deleting products...');
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, name')
    .ilike('name', 'user test%');

  if (productError) {
    console.error('❌ Error fetching products:', productError);
    return;
  }

  if (products && products.length > 0) {
    console.log(`   Found ${products.length} products to delete:`);
    for (const product of products) {
      console.log(`   - ${product.name}`);
    }

    const { error: deleteProductError } = await supabase
      .from('products')
      .delete()
      .ilike('name', 'user test%');

    if (deleteProductError) {
      console.error('❌ Error deleting products:', deleteProductError);
    } else {
      console.log(`   ✅ Deleted ${products.length} products\n`);
    }
  } else {
    console.log('   No test products found\n');
  }

  // Delete categories
  console.log('📁 Deleting categories...');
  const { data: categories, error: categoryError } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', 'user test%');

  if (categoryError) {
    console.error('❌ Error fetching categories:', categoryError);
    return;
  }

  if (categories && categories.length > 0) {
    console.log(`   Found ${categories.length} categories to delete:`);
    for (const category of categories) {
      console.log(`   - ${category.name}`);
    }

    const { error: deleteCategoryError } = await supabase
      .from('categories')
      .delete()
      .ilike('name', 'user test%');

    if (deleteCategoryError) {
      console.error('❌ Error deleting categories:', deleteCategoryError);
    } else {
      console.log(`   ✅ Deleted ${categories.length} categories\n`);
    }
  } else {
    console.log('   No test categories found\n');
  }

  console.log('✅ Test data deletion complete!');
}

deleteTestData().catch(console.error);
