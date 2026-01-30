-- =============================================
-- Migration: Fix product_images alt column name
-- Description: Ensure alt column exists for consistency
-- =============================================

-- Check if alt_text exists and alt doesn't, then rename
DO $$
BEGIN
  -- If alt_text column exists but alt doesn't, rename it
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_images'
    AND column_name = 'alt_text'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_images'
    AND column_name = 'alt'
  ) THEN
    ALTER TABLE product_images RENAME COLUMN alt_text TO alt;
  END IF;

  -- If neither exists, add alt column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_images'
    AND column_name = 'alt'
  ) THEN
    ALTER TABLE product_images ADD COLUMN alt TEXT;
  END IF;
END $$;

-- Add comment
COMMENT ON COLUMN product_images.alt IS '이미지 대체 텍스트 (접근성)';
