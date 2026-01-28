/**
 * order_items 테이블만 생성
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rwuvldzhpfnlrnyykyxl:Hn@UkRDjKEu8U+p@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';
const ssl = { rejectUnauthorized: false };

async function createOrderItems() {
  const client = new Client({
    connectionString,
    ssl,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const sql = `
-- Order Items 테이블 생성
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_snapshot JSONB NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  total_price INTEGER NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_created_at ON order_items(created_at DESC);

-- 트리거
CREATE TRIGGER set_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
    `;

    await client.query(sql);
    console.log('✅ order_items table created successfully');

    // 테이블 확인
    const result = await client.query(
      "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items');"
    );
    console.log(`order_items exists: ${result.rows[0].exists}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

createOrderItems().catch(console.error);
