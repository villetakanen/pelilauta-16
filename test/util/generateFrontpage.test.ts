import { siteFrom } from '@schemas/SiteSchema';
import { expect, test } from 'vitest';
import { generateFrontPage } from '../../src/utils/siteUtils';

test('generateFrontPage creates a front page with correct properties', () => {
  const site = siteFrom({
    key: 'test-site',
    name: 'Test Site',
    description: 'This is a test site.',
    owners: ['user1'],
  });

  const frontPage = generateFrontPage(site, 'user1');
  expect(frontPage).toHaveProperty('key', 'test-site');
  expect(frontPage).toHaveProperty('siteKey', 'test-site');
  expect(frontPage).toHaveProperty('name', 'Test Site');
  expect(frontPage).toHaveProperty(
    'markdownContent',
    '# Test Site \n\n*This is a test site.*',
  );
  expect(frontPage).toHaveProperty('owners', ['user1']);
});
