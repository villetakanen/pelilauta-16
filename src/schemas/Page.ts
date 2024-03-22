import { EntrySchema } from './Entry'
import { z } from 'zod'

export const PageSchema = EntrySchema.extend({
  name: z.string(),
  parentKey: z.string(),
})

export type Page = z.infer<typeof PageSchema>
