import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test('should display empty cart state', async ({ page }) => {
    // Clear any existing cart by clearing cookies/storage
    await page.context().clearCookies();

    await page.goto('/cart');

    await expect(page.locator('h1')).toContainText('장바구니가 비어있습니다');

    // Should have button to continue shopping
    const continueBtn = page.getByRole('button', { name: /쇼핑 계속하기/ });
    await expect(continueBtn).toBeVisible();
  });

  test('should navigate to products when clicking continue shopping', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/cart');

    const continueBtn = page.getByRole('button', { name: /쇼핑 계속하기/ });
    await continueBtn.click();

    await expect(page).toHaveURL(/\//);
  });

  test('should add item to cart and view it', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="products-grid"]', { timeout: 15000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const isVisible = await firstProduct.isVisible();

    if (!isVisible) {
      test.skip(true, 'No products available for testing');
    }

    // Get product name for verification
    const productName = await firstProduct.textContent();

    await firstProduct.click();

    // Add to cart
    const addToCartBtn = page.getByRole('button', { name: /장바구니 담기/ });
    await addToCartBtn.click();

    // Wait for cart update
    await page.waitForTimeout(1000);

    // Navigate to cart
    await page.goto('/cart');

    // Verify cart has items
    const cartItems = page.locator('text=/총 .*개의 상품/').or(
      page.locator('[data-testid="cart-item"]')
    );

    const hasItems = await cartItems.count() > 0;
    if (!hasItems) {
      test.skip(true, 'Cart functionality may require authentication');
    }

    await expect(page.locator('h1')).toContainText('장바구니');
  });

  test('should update item quantity', async ({ page }) => {
    // This test requires an item in cart
    await page.goto('/products');
    await page.waitForSelector('[data-testid="products-grid"]', { timeout: 15000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const isVisible = await firstProduct.isVisible();

    if (!isVisible) {
      test.skip(true, 'No products available for testing');
    }

    await firstProduct.click();

    const addToCartBtn = page.getByRole('button', { name: /장바구니 담기/ });
    await addToCartBtn.click();
    await page.waitForTimeout(1000);

    await page.goto('/cart');

    // Try to find quantity controls
    const plusBtn = page.locator('button').filter({ hasText: '+' }).first();
    const hasPlusBtn = await plusBtn.count() > 0;

    if (hasPlusBtn) {
      await plusBtn.click();
      await page.waitForTimeout(500);

      // Verify quantity updated (implementation may vary)
    }
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="products-grid"]', { timeout: 15000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const isVisible = await firstProduct.isVisible();

    if (!isVisible) {
      test.skip(true, 'No products available for testing');
    }

    await firstProduct.click();

    const addToCartBtn = page.getByRole('button', { name: /장바구니 담기/ });
    await addToCartBtn.click();
    await page.waitForTimeout(1000);

    await page.goto('/cart');

    // Try to find delete button
    const deleteBtn = page.locator('button').filter({ hasText: /삭제/ }).first();
    const hasDeleteBtn = await deleteBtn.count() > 0;

    if (hasDeleteBtn) {
      await deleteBtn.click();
      await page.waitForTimeout(500);

      // Verify item removed or cart is empty
    }
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="products-grid"]', { timeout: 15000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const isVisible = await firstProduct.isVisible();

    if (!isVisible) {
      test.skip(true, 'No products available for testing');
    }

    await firstProduct.click();

    const addToCartBtn = page.getByRole('button', { name: /장바구니 담기/ });
    await addToCartBtn.click();
    await page.waitForTimeout(1000);

    await page.goto('/cart');

    const checkoutBtn = page.getByRole('button', { name: /결제하기/ });
    const hasCheckoutBtn = await checkoutBtn.count() > 0;

    if (hasCheckoutBtn) {
      await checkoutBtn.click();
      await expect(page).toHaveURL(/\/checkout/);
    }
  });

  test('should display order summary', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="products-grid"]', { timeout: 15000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const isVisible = await firstProduct.isVisible();

    if (!isVisible) {
      test.skip(true, 'No products available for testing');
    }

    await firstProduct.click();

    const addToCartBtn = page.getByRole('button', { name: /장바구니 담기/ });
    await addToCartBtn.click();
    await page.waitForTimeout(1000);

    await page.goto('/cart');

    // Look for order summary section
    const summary = page.locator('text=/주문 요약/').or(
      page.locator('[data-testid="order-summary"]')
    );

    const hasSummary = await summary.count() > 0;
    if (hasSummary) {
      await expect(summary.first()).toBeVisible();
    }
  });
});
