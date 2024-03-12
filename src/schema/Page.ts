import { z } from 'zod'

export const PageSchema = z.object({
  key: z.string(),
  parentKey: z.string(),
  name: z.string(),
  flowTime: z.number(),
  markdownContent: z.string(),
})

export type Page = z.infer<typeof PageSchema>
