import {
  NotificationSchema,
  ParseNotification,
} from '@schemas/NotificationSchema';
import { expect, test } from 'vitest';

test('ParseNotification creates a notification object', () => {
  const notification = ParseNotification({
    key: '123',
    createdAt: new Date(),
    from: 'user1',
    to: 'user2',
    message: 'Hello',
    targetKey: '456',
    targetType: 'site.loved',
    read: false,
  });
  const parsed = NotificationSchema.parse(notification);
  expect(parsed).toEqual(notification);
});
