// This is a generic scema for characters built with the character builder.
// It does not care about the presentation or the system.

import { z } from 'zod';
import { CharacterFeatureSchema } from './CharacterBuilderSchema';

export const CharacterStatSchema = z.object({
  key: z.string().default('').describe('Unique identifier for the stat'),
  value: z.number().default(0).describe('Value of the stat'),
});

export type CharacterStat = z.infer<typeof CharacterStatSchema>;

export const CharacterSheetSchema = z
  .object({
    name: z.string().default('').describe('Name of the character'),
    system: z
      .string()
      .default('')
      .describe('System the character is built for'),
    stats: z
      .array(CharacterStatSchema)
      .default([])
      .describe('List of stats for the character'),
    extras: z
      .array(CharacterFeatureSchema)
      .default([])
      .describe('List of additional features or abilities for the character'),
  })
  .describe(
    'Schema for a character sheet, containing basic information and stats',
  );

export type CharacterSheet = z.infer<typeof CharacterSheetSchema>;
