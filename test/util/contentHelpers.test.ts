import { expect, test } from 'vitest';
import { toDisplayString } from '../../src/utils/contentHelpers';

test('toDisplayString returns N/A if date is undefined', () => {
  expect(toDisplayString(undefined)).toBe('N/A');
});

test('toDisplayString returns date as string', () => {
  const date = new Date('2021-12-24');
  expect(toDisplayString(date)).toBe(date.toLocaleString());
});
