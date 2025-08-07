import type { Site } from '@schemas/SiteSchema';
import { expect, test } from 'vitest';
import { getMarkedInstance } from '../../src/utils/shared/getMarked';

const mockSite: Site = {
  key: 'test-site',
  name: 'Test Site',
  assets: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  description: 'A test site for unit testing',
  flowTime: 0,
  owners: [],
  hidden: false,
  sortOrder: 'createdAt',
};

test('getMarked with site returns a function that can render in-site links', async () => {
  const marked = getMarkedInstance('https://example.com', {
    site: mockSite,
  });

  const result = marked.parse('[Test Link](test-link)');
  expect(result).toContain(
    '<a href="https://example.com/sites/test-site/test-link">Test Link</a>',
  );
});

test('getMarked with site returns a function that can render external links', async () => {
  const marked = getMarkedInstance('https://example.com', {
    site: mockSite,
  });

  const result = marked.parse('[External Link](https://external.com)');
  expect(result).toContain('<a href="https://external.com">External Link</a>');
});

test('getMarked with site returns a function that can render wikilink shortcuts', async () => {
  const marked = getMarkedInstance('https://example.com', {
    site: mockSite,
  });

  const result = marked.parse('[[Test Link | obsidian style link]]');
  expect(result).toContain(
    '<a href="https://example.com/sites/test-site/test-link">obsidian style link</a>',
  );
});

test('getMarked should convert a basic @profile tag into a link', async () => {
  const marked = getMarkedInstance('https://example.com', { site: mockSite });
  const result = await marked.parse('Hello @test-user');
  expect(result).toContain(
    '<a href="https://example.com/profiles/test-user">@test-user</a>',
  );
});

test('getMarked should not convert an email address', async () => {
  const marked = getMarkedInstance('https://example.com', { site: mockSite });
  const markdown = 'My email is test@example.com.';
  const result = await marked.parse(markdown);
  expect(result).toBe('<p>My email is test@example.com.</p>\n');
});

test('getMarked should convert a tag at the beginning of a line', async () => {
  const marked = getMarkedInstance('https://example.com', { site: mockSite });
  const result = await marked.parse('@start');
  expect(result).toContain(
    '<a href="https://example.com/profiles/start">@start</a>',
  );
});

test('getMarked should handle multiple tags correctly', async () => {
  const marked = getMarkedInstance('https://example.com', { site: mockSite });
  const result = await marked.parse('cc @admin and @moderator');
  expect(result).toContain(
    '<a href="https://example.com/profiles/admin">@admin</a>',
  );
  expect(result).toContain(
    '<a href="https://example.com/profiles/moderator">@moderator</a>',
  );
});

test('getMarked should handle tags with special characters like ä, ö, å', async () => {
  const marked = getMarkedInstance('https://example.com', { site: mockSite });
  const result = await marked.parse('Ping @käyttäjä-1');
  const expectedHref = 'https://example.com/profiles/k%C3%A4ytt%C3%A4j%C3%A4-1';
  expect(result).toContain(`<a href="${expectedHref}">@käyttäjä-1</a>`);
});

test('getMarked should not convert a tag that is not preceded by whitespace', async () => {
  const marked = getMarkedInstance('https://example.com', { site: mockSite });
  const markdown = 'Anexample@tag';
  const result = await marked.parse(markdown);
  expect(result).toBe('<p>Anexample@tag</p>\n');
});
test('getMarked should handle a tag at the end of the string', async () => {
  const marked = getMarkedInstance('https://example.com', { site: mockSite });
  const result = await marked.parse('This is a test for @final-tag');
  expect(result).toContain(
    '<a href="https://example.com/profiles/final-tag">@final-tag</a>',
  );
});
