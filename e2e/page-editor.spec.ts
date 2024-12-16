import { expect, test } from '@playwright/test';
import { email, password } from '../playwright/.auth/credentials';

async function authenticate(page) {
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
}

test('Page name can be changed', async ({ page }) => {
  await authenticate(page);
  await page.goto('http://localhost:4321/sites/e2e-test-site/front-page/edit');

  // Expect the user to be authenticated
  await expect(page.getByTestId('setting-navigation-button')).toBeVisible();

  // Expect the submit button to be disabled, as there are no changes
  await expect(page.getByTestId('save-button')).toBeDisabled();

  // Change the name of the page
  await page.getByTestId('page-name').fill('New Front Page');

  // Expect the submit button to be enabled, as there are changes
  await expect(page.getByTestId('save-button')).toBeEnabled();

  // Expect the page to have a category selector
  await expect(page.getByTestId('page-category')).toBeVisible();

  // Change the category of the page to 'Omega'
  await page.getByTestId('page-category').selectOption({ label: 'Omega' });

  // Expect the submit button to be enabled, as there are changes
  await expect(page.getByTestId('save-button')).toBeEnabled();

  // Edit the content of the page, by adding a new text block, includig tags "Here is some #text with #tags"
  await page
    .getByTestId('content-editor')
    .fill('Here is some #text with #tags');

  // Expect the we have the tags listed in the tag list
  await expect(page.getByTestId('tag-list')).toContainText('text');
  await expect(page.getByTestId('tag-list')).toContainText('tags');
});
