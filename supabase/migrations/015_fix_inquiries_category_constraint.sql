-- =====================================================
-- Migration: 015_fix_inquiries_category_constraint.sql
-- Description: Fix inquiries category constraint to match app schema
-- Author: claude
-- Date: 2026-01-30
-- =====================================================

-- Drop the old category constraint
ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_category_check;

-- Add the corrected constraint matching the application schema
ALTER TABLE inquiries ADD CONSTRAINT inquiries_category_check
  CHECK (category IN ('product', 'shipping', 'refund', 'etc'));

-- Update any existing records with 'payment' category to 'refund'
UPDATE inquiries
SET category = 'refund'
WHERE category = 'payment';

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ inquiries category constraint fixed';
  RAISE NOTICE '   Changed allowed values from: product, shipping, payment, etc';
  RAISE NOTICE '   To: product, shipping, refund, etc';
  RAISE NOTICE '   Existing records with payment category updated to refund';
END $$;
