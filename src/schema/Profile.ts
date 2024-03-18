import { z } from 'zod'

export const ProfileSchema = z.object({
  nick: z.string(),
  avatarURL: z.string().optional(),
  bio: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export type Profile = z.infer<typeof ProfileSchema>