import { z } from 'zod';

export const EntrySchema = z.object({
  key: z.string(),
  flowTime: z.coerce.number().default(0),
  owners: z.array(z.string()).default([]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ContentEntrySchema = EntrySchema.extend({
  public: z.boolean().optional(),
  sticky: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  markdownContent: z.string().optional(),
  htmlContent: z.string().optional(),
  content: z.string().optional(), // Legacy content field
  images: z.array(z.string()).optional(),
  owners: z.array(z.string()),
});

// Types
export type Entry = z.infer<typeof EntrySchema>;
export type ContentEntry = z.infer<typeof ContentEntrySchema>;

export function contentEntryFrom(
  data: Partial<ContentEntry>,
  key?: string,
): ContentEntry {
  return ContentEntrySchema.parse({
    ...data,
    key: key || data.key || '',
    owners: data.owners || [],
    markdownContent: data.markdownContent || '',
    htmlContent: data.htmlContent || '',
    content: data.content || '',
    images: data.images || [],
  });
}
