import { z } from 'zod';

export const CHARACTER_BUILDERS_COLLECTION_NAME = 'builders';

export const CHARACTER_MODIFIER_TYPES = [
  'BASE_STAT', // A base stat, like Strength, Dexterity, etc.
  'STAT_BONUS', // A bonus to a stat, like +2 to Strength score
  'FEATURE', // A generic feature, will be listed in the features array
] as const;

export const CharacterMofdifierSchema = z
  .object({
    type: z.enum(CHARACTER_MODIFIER_TYPES).describe('Type of the modifier'),
    target: z
      .string()
      .optional()
      .describe("Target of the modifier, e.g. 'strength' or 'dexterity'"),
    value: z
      .number()
      .optional()
      .describe('Value of the modifier, e.g. +2 or -1'),
    title: z
      .string()
      .optional()
      .describe("Title of the modifier, e.g. 'Strong' or 'Agile'"),
    description: z
      .string()
      .optional()
      .describe(
        "Description of the modifier, e.g. 'You are strong and can lift heavy objects.'",
      ),
    source: z
      .string()
      .optional()
      .describe("Source stat, e.g. 'Proficiency Bonus' or 'Strength Bonus'"),
  })
  .describe('Schema for character modifiers profivded by a feature');

export type CharacterMofdifier = z.infer<typeof CharacterMofdifierSchema>;

export const CharacterFeatureSchema = z
  .object({
    key: z.string().default('').describe('Unique identifier for the feature'),
    characterBuilderKey: z
      .string()
      .default('')
      .describe('Key of the character builder this feature belongs to'),
    name: z.string().default('').describe('User-friendly name for the feature'),
    description: z.string().optional().describe('Description of the feature'),
    modifiers: z
      .array(CharacterMofdifierSchema)
      .optional()
      .describe('List of modifiers provided by this feature'),
  })
  .describe('Schema for character features');

export type CharacterFeature = z.infer<typeof CharacterFeatureSchema>;

const STEP_TYPES = ['select', 'set_base', 'meta'] as const;

export const CharacterBuilderStepSchema = z
  .object({
    key: z.string().default('').describe('Unique identifier for the step'),
    name: z.string().default('').describe('User-friendly name for the step'),
    type: z
      .enum(STEP_TYPES)
      .optional()
      .describe(
        'Type of the step, e.g. "select" for feature selection, "set_base" for setting base stats, or "meta" for setting character metadata',
      ),
    description: z
      .string()
      .describe('Instructions or flavor text for the user.'),
    min: z
      .number()
      .default(1)
      .describe('Minimum number of features choosable in this step'),
    max: z
      .number()
      .default(1)
      .describe('Maximum number of features choosable in this step'),
    features: z
      .array(CharacterFeatureSchema)
      .default([])
      .describe('List of features available in this step'),
  })
  .describe('Schema for character builder steps');

export type CharacterBuilderStep = z.infer<typeof CharacterBuilderStepSchema>;

export const CharacterBuilderSchema = z
  .object({
    key: z.string().default('').describe('Unique identifier for the journey'),
    name: z
      .string()
      .default('')
      .describe('Name of the builder, e.g. D&D character creator'),
    description: z.string().default('').describe('Description of the builder'),
    system: z
      .string()
      .default('')
      .describe('System Identifier for the builder, e.g. dd or homebrew'),
    characterSheetKey: z
      .string()
      .optional()
      .describe(
        'Key of the character sheet to use for displaying characters created with this builder',
      ),
    steps: z
      .array(CharacterBuilderStepSchema)
      .default([])
      .describe('List of steps in the character builder'),
  })
  .describe('Schema for character builders');

export type CharacterBuilder = z.infer<typeof CharacterBuilderSchema>;
