import { test, expect } from '@playwright/test';

test('game loads correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/trae-game/');

  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  const startButton = page.locator('.btn-start');
  await expect(startButton).toBeVisible();

  await startButton.click();

  const joystickOverlay = page.locator('.joystick-overlay');
  await expect(joystickOverlay).toBeVisible();
});
