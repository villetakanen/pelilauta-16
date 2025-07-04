// This is a generic scema for characters built with the character builder.
// It does not care about the presentation or the system.

import { z } from 'zod';
import { CharacterFeatureSchema } from './CharacterBuilderSchema';

export const CHARACTER_SHEETS_COLLECTION_NAME = 'sheets';

export const CharacterStatSchema = z.object({
  key: z
    .string()
    .default('')
    .describe(
      'Unique identifier for the stat - must match the builder schema key for a stat',
    ),
  value: z.number().optional().describe('Value of the stat, e.g. +1, -2, etc.'),
  displayValue: z
    .string()
    .optional()
    .describe('Optional display value for the stat, e.g. "17" or "Expert"'),
  description: z
    .string()
    .optional()
    .describe(
      'Optional description for the stat, e.g. "Strength" or "Dexterity"',
    ),
});

export type CharacterStat = z.infer<typeof CharacterStatSchema>;

export const CharacterSheetSchema = z
  .object({
    key: z
      .string()
      .default('')
      .describe('Unique identifier for the character sheet'),
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
    meta: z
      .record(z.string(), z.string())
      .optional()
      .describe('Arbitrary key-value metadata for the character sheet'),
  })
  .describe(
    'Schema for a character sheet, containing basic information and stats',
  );

export type CharacterSheet = z.infer<typeof CharacterSheetSchema>;
