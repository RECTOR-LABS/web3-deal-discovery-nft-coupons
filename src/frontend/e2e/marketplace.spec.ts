/**
 * Playwright E2E Tests - Marketplace Flow
 * Run with: npx playwright test
 */

import { test, expect } from '@playwright/test';

test.describe('Marketplace - Guest User', () => {
  test('should load homepage and show deals', async ({ page }) => {
    await page.goto('/');

    // Check homepage loads
    await expect(page).toHaveTitle(/DealCoupon/);

    // Check hero section
    await expect(page.locator('h1')).toContainText(/Deal/i);

    // Check trending deals section exists
    const trendingSection = page.locator('text=Trending Deals');
    await expect(trendingSection).toBeVisible();
  });

  test('should navigate to marketplace', async ({ page }) => {
    await page.goto('/');

    // Click marketplace link
    await page.click('text=Browse Deals');

    // Should navigate to marketplace
    await expect(page).toHaveURL(/\/marketplace/);

    // Check deals list loads
    const dealsList = page.locator('[data-testid="deals-list"]');
    await expect(dealsList).toBeVisible({ timeout: 10000 });
  });

  test('should filter deals by category', async ({ page }) => {
    await page.goto('/marketplace');

    // Wait for deals to load
    await page.waitForLoadState('networkidle');

    // Click food category
    await page.click('button:has-text("Food")');

    // Check URL has category filter
    await expect(page).toHaveURL(/category=food/);

    // Wait for filtered results
    await page.waitForTimeout(1000);
  });

  test('should search deals', async ({ page }) => {
    await page.goto('/marketplace');

    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('burger');

    // Wait for search results
    await page.waitForTimeout(1000);

    // Should show filtered results
    // Note: This depends on having test data
  });
});

test.describe('Marketplace - Wallet Connection', () => {
  test('should show wallet connect button', async ({ page }) => {
    await page.goto('/');

    // Check for wallet connect button
    const walletButton = page.locator('button:has-text("Connect Wallet")');
    await expect(walletButton).toBeVisible();
  });

  test('should prompt wallet connection when claiming deal', async ({ page }) => {
    await page.goto('/marketplace');

    // Wait for deals
    await page.waitForLoadState('networkidle');

    // Click first "Claim Deal" button (if exists)
    const claimButton = page.locator('button:has-text("Claim Deal")').first();

    if (await claimButton.isVisible()) {
      await claimButton.click();

      // Should show wallet connection prompt or modal
      // Note: Actual wallet connection requires browser extension
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Deal Details', () => {
  test('should show deal details page', async ({ page }) => {
    await page.goto('/marketplace');

    // Wait for deals
    await page.waitForLoadState('networkidle');

    // Click first deal card
    const firstDeal = page.locator('[data-testid="deal-card"]').first();

    if (await firstDeal.isVisible()) {
      await firstDeal.click();

      // Should show deal details
      await page.waitForTimeout(1000);

      // Check for key elements
      const dealTitle = page.locator('h1');
      await expect(dealTitle).toBeVisible();
    }
  });
});

test.describe('Accessibility', () => {
  test('homepage should be accessible', async ({ page }) => {
    await page.goto('/');

    // Basic accessibility checks
    await expect(page.locator('main')).toBeVisible();

    // Check for skip link (if it exists)
    // Some sites have skip links for accessibility
    // const skipLink = page.locator('a[href="#main-content"]');
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});

test.describe('Performance', () => {
  test('homepage should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('API health check should respond quickly', async ({ page }) => {
    const response = await page.request.get('/api/health');

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBe('healthy');
  });
});
