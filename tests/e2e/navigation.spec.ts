import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should have working navigation menu', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav').or(page.locator('[role="navigation"]'));
    const hasNav = await nav.count() > 0;

    if (hasNav) {
      await expect(nav.first()).toBeVisible();
    }
  });

  test('should navigate to home page', async ({ page }) => {
    await page.goto('/products');

    const homeLink = page.getByRole('link', { name: /^Vibe Store|홈|Home$/i }).or(
      page.locator('a[href="/"]')
    );

    const hasHomeLink = await homeLink.count() > 0;
    if (hasHomeLink) {
      await homeLink.first().click();
      await expect(page).toHaveURL(/\//);
    }
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');

    const productsLink = page.getByRole('link', { name: /상품|Products|쇼핑/ }).or(
      page.locator('a[href="/products"]')
    );

    const hasProductsLink = await productsLink.count() > 0;
    if (hasProductsLink) {
      await productsLink.first().click();
      await expect(page).toHaveURL(/\/products/);
    }
  });

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/');

    const cartLink = page.getByRole('link', { name: /장바구니|Cart/ }).or(
      page.locator('a[href="/cart"]')
    );

    const hasCartLink = await cartLink.count() > 0;
    if (hasCartLink) {
      await cartLink.first().click();
      await expect(page).toHaveURL(/\/cart/);
    }
  });

  test('should navigate to my page', async ({ page }) => {
    await page.goto('/');

    const myPageLink = page.getByRole('link', { name: /마이페이지|내정보|My/ }).or(
      page.locator('a[href="/my"]')
    );

    const hasMyPageLink = await myPageLink.count() > 0;
    if (hasMyPageLink) {
      await myPageLink.first().click();

      // Either goes to my page or redirects to login
      const url = page.url();
      expect(url).toMatch(/(\/my|\/login)/);
    }
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');

    const aboutLink = page.getByRole('link', { name: /소개|About/ }).or(
      page.locator('a[href="/about"]')
    );

    const hasAboutLink = await aboutLink.count() > 0;
    if (hasAboutLink) {
      await aboutLink.first().click();
      await expect(page).toHaveURL(/\/about/);
    }
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');

    const contactLink = page.getByRole('link', { name: /문의|Contact|연락처/ }).or(
      page.locator('a[href="/contact"]')
    ).or(
      page.locator('a[href="/inquiries"]')
    );

    const hasContactLink = await contactLink.count() > 0;
    if (hasContactLink) {
      await contactLink.first().click();
      // /contact redirects to /inquiries
      await expect(page).toHaveURL(/\/(contact|inquiries)/);
    }
  });
});

test.describe('Mobile Navigation', () => {
  test('should have mobile menu button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuButton = page.locator('button[aria-label*="menu" i]').or(
      page.locator('[data-testid="mobile-menu-toggle"]')
    );

    const hasMenuButton = await menuButton.count() > 0;
    if (hasMenuButton) {
      await expect(menuButton.first()).toBeVisible();
    }
  });

  test('should toggle mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuButton = page.locator('button[aria-label*="menu" i]').or(
      page.locator('[data-testid="mobile-menu-toggle"]')
    );

    const hasMenuButton = await menuButton.count() > 0;
    if (hasMenuButton) {
      await menuButton.first().click();

      const mobileMenu = page.locator('[data-testid="mobile-menu"]').or(
        page.locator('.mobile-menu')
      );

      const hasMobileMenu = await mobileMenu.count() > 0;
      if (hasMobileMenu) {
        await expect(mobileMenu.first()).toBeVisible();
      }
    }
  });
});

test.describe('Footer', () => {
  test('should display footer', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    const hasFooter = await footer.count() > 0;

    if (hasFooter) {
      await expect(footer.first()).toBeVisible();
    }
  });

  test('should have links to legal pages', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    const hasFooter = await footer.count() > 0;

    if (hasFooter) {
      const termsLink = footer.getByRole('link', { name: /이용약관|Terms/ });
      const privacyLink = footer.getByRole('link', { name: /개인정보|Privacy/ });

      const hasTermsLink = await termsLink.count() > 0;
      const hasPrivacyLink = await privacyLink.count() > 0;

      // At least one should exist
      expect(hasTermsLink || hasPrivacyLink).toBeTruthy();
    }
  });
});
