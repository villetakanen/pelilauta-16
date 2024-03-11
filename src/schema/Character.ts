import { z } from 'zod'

export const CharacterSchema = z.object({
    key: z.string(),
    name: z.string(),
    flowTime: z.number(),
    markdownContent: z.string().optional(),
  })
  
export type Character = z.infer<typeof CharacterSchema>