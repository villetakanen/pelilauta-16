import { expect, test as setup } from '@playwright/test';
import { email, password } from 'playwright/.auth/credentials';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('http://localhost:4321/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('http://localhost:4321/');
  await page.goto('http://localhost:4321/settings');
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByRole('heading', { name: 'Asetukset' })).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
