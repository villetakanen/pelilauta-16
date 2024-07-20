import { expect, test } from 'vitest';
import { SiteSchema, createSite } from '../../src/schemas/SiteSchema';

test('createSite factory creates a site object', () => {
  const site = createSite();
  const parsed = SiteSchema.parse(site);
  expect(parsed).toEqual(site);
});
