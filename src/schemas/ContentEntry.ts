import { z } from 'zod';

export const EntrySchema = z.object({
  key: z.string(),
  flowTime: z.number(),
  owners: z.array(z.string()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
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

export type Entry = z.infer<typeof EntrySchema>;

export type ContentEntry = z.infer<typeof ContentEntrySchema>;

export function contentEntryFrom(
  data: Partial<ContentEntry>,
  key = '',
): ContentEntry {
  return ContentEntrySchema.parse({
    ...data,
    key,
    flowTime: data.flowTime || Date.now(),
    owners: data.owners || [],
    markdownContent: data.markdownContent || '',
    htmlContent: data.htmlContent || '',
    content: data.content || '',
    images: data.images || [],
  });
}
