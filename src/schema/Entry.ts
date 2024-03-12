import { z } from 'zod'

export const EntrySchema = z.object({
  key: z.string(),
  flowTime: z.number(),
  title: z.string(),
  markdownContent: z.string().optional(),
  htmlContent: z.string().optional(),
})

export type Entry = z.infer<typeof EntrySchema>
