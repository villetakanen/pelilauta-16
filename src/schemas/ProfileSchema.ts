import { toFid } from '@utils/toFid';
import { z } from 'zod';

export const PROFILES_COLLECTION_NAME = 'profiles';

export const ProfileSchema = z.object({
  key: z.string().optional(),
  username: z.string().optional(),
  nick: z.string(),
  avatarURL: z.string().optional(),
  bio: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export function parseProfile(
  data: Record<string, unknown>,
  key: string,
): Profile {
  const nick = data.nick ? (data.nick as string) : 'N.N.';

  const avatarURL = data.avatarURL ? data.avatarURL : generateAvatarURL(nick);

  const username = data.username ? data.username : toFid(nick);

  return ProfileSchema.parse({
    ...data,
    nick,
    username,
    avatarURL,
    key,
  });
}

export function generateAvatarURL(nick: string): string {
  if (!nick || nick.length < 2) throw new Error('Invalid nickname');
  // if (p.avatarURL) return p.avatarURL
  // Generate avatar SVG URL based on 2 first letters of nick
  const base64 = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="128" height="128">
      <circle cx=64" cy="64" r="64" fill="var(--cn-color-on-surface)"/>
      <text x="64" y="64" font-size="50" fill="var(--cn-color-surface)" text-anchor="middle" dominant-baseline="middle">${nick.slice(0, 2)}</text>
    </svg>`,
  ).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}
