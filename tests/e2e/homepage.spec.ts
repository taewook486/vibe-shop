import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Vibe Store|vibe-store/);
  });

  test('should display hero section', async ({ page }) => {
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
    await expect(hero).toContainText('디지털 상품 쇼핑몰 스캘레톤');
  });

  test('should display CTA buttons', async ({ page }) => {
    const browseButton = page.getByRole('link', { name: /상품 둘러보기|상품 보러가기/ });
    await expect(browseButton.first()).toBeVisible();
  });

  test('should navigate to products page when clicking browse button', async ({ page }) => {
    const browseButton = page.getByRole('link', { name: /상품 둘러보기/ }).first();
    await browseButton.click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('should display feature cards', async ({ page }) => {
    const features = page.locator('section:has(h2:has-text("주요 기능"))');
    await expect(features).toBeVisible();

    const featureCards = page.locator('[data-testid="feature-card"]');
    await expect(featureCards).toHaveCount(3);
  });

  test('should navigate to about page', async ({ page }) => {
    const aboutLink = page.getByRole('link', { name: '자세히 보기' });
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });
});
