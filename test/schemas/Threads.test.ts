import { expect, test } from 'vitest';
import { ThreadSchema, createThread } from '../../src/schemas/ThreadSchema';

test('createThread factory creates a thread object', () => {
  const thread = createThread(
    {
      title: 'title',
      owners: ['owner 1'],
    },
    'key',
  );
  const parsed = ThreadSchema.parse(thread);
  expect(parsed).toEqual(thread);
});

test('createThread factory creates a thread object with public set to true', () => {
  const thread = createThread();
  expect(thread.public).toBe(true);
});
