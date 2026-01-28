/**
 * orders와 order_items 테이블 생성
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rwuvldzhpfnlrnyykyxl:Hn@UkRDjKEu8U+p@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';
const ssl = { rejectUnauthorized: false };

async function createOrdersAndItems() {
  const client = new Client({
    connectionString,
    ssl,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // 1. orders 테이블 생성
    console.log('\n📄 Creating orders table...');
    const ordersSQL = `
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  payment_method VARCHAR(50),
  payment_id VARCHAR(200),
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  recipient_address TEXT NOT NULL,
  recipient_address_detail TEXT,
  recipient_postcode VARCHAR(10),
  delivery_note TEXT,
  cancelled_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- updated_at 트리거
DROP TRIGGER IF EXISTS set_orders_updated_at ON orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
    `;

    await client.query(ordersSQL);
    console.log('✅ orders table created');

    // 2. order_items 테이블 생성
    console.log('\n📄 Creating order_items table...');
    const orderItemsSQL = `
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
    `;

    await client.query(orderItemsSQL);
    console.log('✅ order_items table created');

    // 테이블 확인
    const ordersResult = await client.query(
      "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders');"
    );
    console.log(`\norders exists: ${ordersResult.rows[0].exists}`);

    const itemsResult = await client.query(
      "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items');"
    );
    console.log(`order_items exists: ${itemsResult.rows[0].exists}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

createOrdersAndItems().catch(console.error);
