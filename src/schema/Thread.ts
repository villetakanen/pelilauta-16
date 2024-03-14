import { z } from 'zod'
import { EntrySchema } from './Entry'

export const ThreadSchema = EntrySchema.extend({
  title: z.string(),
  topic: z.string().optional(),
})

export type Thread = z.infer<typeof ThreadSchema>
