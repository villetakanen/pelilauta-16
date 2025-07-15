import { CharacterSheetSchema } from '@schemas/CharacterSheetSchema';
import { EntrySchema } from '@schemas/EntrySchema';
import { z } from 'zod';

export const CHARACTERS_COLLECTION_NAME = 'characters';

/**
 * The schema for a player character.
 * This is a specific type of Entry in the database.
 */
export const CharacterSchema = EntrySchema.extend({
  /** The name of the character. */
  name: z.string().min(1, 'Character name cannot be empty.'),

  /** A public-facing summary or description of the character. */
  description: z.string().optional(),

  /** An optional, embedded character sheet defining the character's stats and structure. */
  sheet: CharacterSheetSchema.optional(),

  /** URL for the character's avatar image. */
  avatar: z.string().url().optional(),
}).describe('A player character entry.');

export type Character = z.infer<typeof CharacterSchema>;
