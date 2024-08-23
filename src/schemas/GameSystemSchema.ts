import { z } from 'zod';

export const GameSystemSchema = z.object({
  key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  icon: z.string(),
  count: z.number().default(0),
});

export type GameSystem = z.infer<typeof GameSystemSchema>;

export const GameSystemsSchema = z.array(GameSystemSchema);

export type GameSystems = z.infer<typeof GameSystemsSchema>;

export function parseGameSystem(data: Partial<GameSystem>): GameSystem {
  return GameSystemSchema.parse({
    key: data.key,
    title: data.title,
    description: data.description || '',
    icon: data.icon || 'homebrew',
    count: data.count || 0,
  });
}
