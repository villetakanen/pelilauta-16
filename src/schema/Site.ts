import { z } from 'zod'

export const SiteSchema = z.object({
    key: z.string(),
    name: z.string().optional(),
    system: z.string().optional(),
  })
  
export type Site = z.infer<typeof SiteSchema>