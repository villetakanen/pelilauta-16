import { z } from 'zod'

export const SiteSchema = z.object({
    key: z.string(),
    name: z.string(),
    system: z.string().optional(),
    posterURL: z.string().optional(),
    hidden: z.boolean(),
    avatarURL: z.string().optional(),
    flowTime: z.number()
  })
  
export type Site = z.infer<typeof SiteSchema>