import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'send Uusi keskustelu' }).click();
  await page.getByPlaceholder('Otsikko').click();
  await page.getByPlaceholder('Otsikko').fill('Testikeskustelu');
  await expect(page.getByPlaceholder('Otsikko')).toHaveValue('Testikeskustelu');
});
