import { z } from 'zod'

/**
 * A Player character for a role-playing game
 */
export const CharacterSchema = z.object({
    key: z.string(),
    name: z.string(),
    flowTime: z.number(),
    markdownContent: z.string().optional(),
    // The character's stats are a record of key-value pairs,
    // where the key is the name of the stat and the value is the stat's value
    // Each stat belongs to a category (e.g. "Attributes", "Skills", "Abilities")
    statBlocks: z.array(
      z.object({
          name: z.string(),
          attributes: z.record(z.string()).optional(), 
      })
    ).optional(),
  })
  
export type Character = z.infer<typeof CharacterSchema>