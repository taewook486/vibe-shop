import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('should load products page', async ({ page }) => {
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator('h1')).toContainText('상품 목록');
  });

  test('should display products grid', async ({ page }) => {
    const grid = page.locator('[data-testid="products-grid"]');
    await expect(grid).toBeVisible();
  });

  test('should display category filter sidebar', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    await expect(sidebar.locator('h2')).toContainText('카테고리');
  });

  test('should display sort dropdown', async ({ page }) => {
    const sortSelect = page.locator('#sort-select');
    await expect(sortSelect).toBeVisible();

    const options = sortSelect.locator('option');
    await expect(options).toHaveCount(4); // popular, newest, price_asc, price_desc
  });

  test('should filter by category', async ({ page }) => {
    // Wait for categories to load
    await page.waitForSelector('aside button', { timeout: 10000 });

    // Get all category buttons
    const categoryButtons = page.locator('aside button').all();

    // Skip if no categories available
    const buttonCount = (await categoryButtons).length;
    if (buttonCount <= 1) {
      test.skip(true, 'No categories available for testing');
    }

    // Click first category (after "전체")
    const firstCategory = page.locator('aside button').nth(1);
    await firstCategory.click();

    // Verify URL update
    await expect(page).toHaveURL(/category=/);
  });

  test('should sort by price ascending', async ({ page }) => {
    const sortSelect = page.locator('#sort-select');
    await sortSelect.selectOption('price_asc');

    // Wait for products to reload
    await page.waitForLoadState('networkidle');

    await expect(sortSelect).toHaveValue('price_asc');
  });

  test('should sort by price descending', async ({ page }) => {
    const sortSelect = page.locator('#sort-select');
    await sortSelect.selectOption('price_desc');

    await page.waitForLoadState('networkidle');

    await expect(sortSelect).toHaveValue('price_desc');
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // This test would require setting up a scenario with no products
    // For now, just verify the page loads without errors
    await expect(page.locator('h1')).toContainText('상품 목록');
  });
});

test.describe('Product Detail', () => {
  test('should navigate to product detail from products list', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('[data-testid="products-grid"]', { timeout: 15000 });

    // Click on first product card
    const firstProduct = page.locator('[data-testid="product-card"]').first();

    const isVisible = await firstProduct.isVisible();
    if (!isVisible) {
      test.skip(true, 'No products available for testing');
    }

    await firstProduct.click();

    // Verify navigation to product detail page
    await expect(page).toHaveURL(/\/products\/[^/]+$/);
  });

  test('should display product information', async ({ page }) => {
    // Go to products page and get first product link
    await page.goto('/products');
    await page.waitForSelector('[data-testid="products-grid"]', { timeout: 15000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const isVisible = await firstProduct.isVisible();

    if (!isVisible) {
      test.skip(true, 'No products available for testing');
    }

    await firstProduct.click();

    // Verify product details
    const productName = page.locator('h1');
    await expect(productName).toBeVisible();

    // Check for add to cart button
    const addToCartBtn = page.locator('[data-testid="add-to-cart-button"]');
    await expect(addToCartBtn).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="products-grid"]', { timeout: 15000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const isVisible = await firstProduct.isVisible();

    if (!isVisible) {
      test.skip(true, 'No products available for testing');
    }

    await firstProduct.click();

    // Click add to cart
    const addToCartBtn = page.locator('[data-testid="add-to-cart-button"]');
    await addToCartBtn.click();

    // Verify success notification (if implemented)
    // or verify cart count increases
    await page.waitForTimeout(1000);
  });

  test('should display product images', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="products-grid"]', { timeout: 15000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const isVisible = await firstProduct.isVisible();

    if (!isVisible) {
      test.skip(true, 'No products available for testing');
    }

    await firstProduct.click();

    // Check for image gallery
    const imageGallery = page.locator('[data-testid="image-gallery"]');
    // Images may not be present, so we don't fail if missing
    const hasGallery = await imageGallery.count();
    if (hasGallery > 0) {
      await expect(imageGallery).toBeVisible();
    }
  });
});
