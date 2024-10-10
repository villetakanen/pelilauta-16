import { toDate } from '@utils/schemaHelpers';
import { z } from 'zod';

export const NOTIFICATION_FIRESTORE_COLLECTION = 'notifications';

export const NotificationSchema = z.object({
  key: z.string(),
  createdAt: z.date(),
  from: z.string(),
  to: z.string(),
  message: z.string(),
  targetKey: z.string(),
  targetType: z.string(),
  read: z.boolean(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export function ParseNotification(
  n: Partial<Notification>,
  key?: string,
): Notification {
  const from =
    typeof n.from === 'string'
      ? n.from
      : Array.isArray(n.from)
        ? `${n.from[0]}`
        : '';

  return NotificationSchema.parse({
    ...n,
    key: key || n.key || '',
    createdAt: toDate(n.createdAt),
    read: n.read || false,
    from,
  });
}
