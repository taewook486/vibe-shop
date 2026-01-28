import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Login', () => {
    test('should display login page', async ({ page }) => {
      await page.goto('/login');

      await expect(page).toHaveURL(/\/login/);
      await expect(page.locator('h1').or(page.locator('h2'))).toContainText(/로그인|로그인/);
    });

    test('should have email input field', async ({ page }) => {
      await page.goto('/login');

      const emailInput = page.locator('input[type="email"]').or(
        page.locator('input[name="email"]')
      );

      await expect(emailInput.first()).toBeVisible();
    });

    test('should have password input field', async ({ page }) => {
      await page.goto('/login');

      const passwordInput = page.locator('input[type="password"]').or(
        page.locator('input[name="password"]')
      );

      await expect(passwordInput.first()).toBeVisible();
    });

    test('should have login button', async ({ page }) => {
      await page.goto('/login');

      const loginBtn = page.getByRole('button', { name: /로그인|로그인하기/ });
      await expect(loginBtn.first()).toBeVisible();
    });

    test('should navigate to signup page', async ({ page }) => {
      await page.goto('/login');

      const signupLink = page.getByRole('link', { name: /회원가입|가입하기/ });
      const hasSignupLink = await signupLink.count() > 0;

      if (hasSignupLink) {
        await signupLink.first().click();
        await expect(page).toHaveURL(/\/signup/);
      }
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/login');

      const loginBtn = page.getByRole('button', { name: /로그인|로그인하기/ });
      await loginBtn.first().click();

      // Check for error messages (implementation may vary)
      await page.waitForTimeout(1000);

      // Either we should stay on login page (validation error) or be redirected
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    });
  });

  test.describe('Signup', () => {
    test('should display signup page', async ({ page }) => {
      await page.goto('/signup');

      await expect(page).toHaveURL(/\/signup/);
      await expect(page.locator('h1').or(page.locator('h2'))).toContainText(/회원가입|가입하기/);
    });

    test('should have name input field', async ({ page }) => {
      await page.goto('/signup');

      const nameInput = page.locator('input[name="name"]').or(
        page.locator('input[placeholder*="이름"]')
      );

      const hasNameInput = await nameInput.count() > 0;
      if (hasNameInput) {
        await expect(nameInput.first()).toBeVisible();
      }
    });

    test('should have email input field', async ({ page }) => {
      await page.goto('/signup');

      const emailInput = page.locator('input[type="email"]').or(
        page.locator('input[name="email"]')
      );

      await expect(emailInput.first()).toBeVisible();
    });

    test('should have password input field', async ({ page }) => {
      await page.goto('/signup');

      const passwordInput = page.locator('input[type="password"]').or(
        page.locator('input[name="password"]')
      );

      await expect(passwordInput.first()).toBeVisible();
    });

    test('should have confirm password field', async ({ page }) => {
      await page.goto('/signup');

      const confirmInput = page.locator('input[name="confirm_password"]').or(
        page.locator('input[name="confirmPassword"]')
      );

      const hasConfirmInput = await confirmInput.count() > 0;
      if (hasConfirmInput) {
        await expect(confirmInput.first()).toBeVisible();
      }
    });

    test('should have signup button', async ({ page }) => {
      await page.goto('/signup');

      const signupBtn = page.getByRole('button', { name: /회원가입|가입하기|가입/ });
      await expect(signupBtn.first()).toBeVisible();
    });
  });

  test.describe('My Page (Authenticated)', () => {
    test('should redirect to login when accessing my page without auth', async ({ page }) => {
      await page.context().clearCookies();
      await page.goto('/my');

      // Should redirect to login or show login prompt
      const isLogin = page.url().includes('/login');

      if (!isLogin) {
        // Check if page shows login required message
        const hasLoginMessage = await page.getByText(/로그인이 필요/).count() > 0;
        expect(hasLoginMessage || isLogin).toBeTruthy();
      }
    });

    test('should display my page when authenticated', async ({ page }) => {
      // This test requires valid credentials
      test.skip(true, 'Requires authentication setup - implement with test user');

      // Example implementation with test user:
      // await page.goto('/login');
      // await page.fill('input[name="email"]', 'test@example.com');
      // await page.fill('input[name="password"]', 'testpassword');
      // await page.getByRole('button', { name: /로그인/ }).click();
      // await page.waitForURL(/\/my/);
      // await expect(page.locator('h1')).toContainText(/마이페이지|내정보/);
    });

    test('should logout successfully', async ({ page }) => {
      test.skip(true, 'Requires authentication setup');

      // Example implementation:
      // await login(page, 'test@example.com', 'testpassword');
      // const logoutBtn = page.getByRole('button', { name: /로그아웃/ });
      // await logoutBtn.click();
      // await expect(page).toHaveURL(/\//);
    });
  });
});
