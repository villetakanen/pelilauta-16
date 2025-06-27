import {
  type CharacterBuilder,
  CharacterBuilderSchema,
  CharacterBuilderStepSchema,
  CharacterFeatureSchema,
  CharacterMofdifierSchema,
} from '@schemas/CharacterBuilderSchema';
import { describe, expect, it } from 'vitest';

describe('CharacterMofdifierSchema', () => {
  it('should validate a BASE_STAT modifier', () => {
    const modifier = {
      type: 'BASE_STAT',
      target: 'strength',
      value: 15,
      title: 'Base Strength',
      description: 'Your base strength score',
    };

    expect(() => CharacterMofdifierSchema.parse(modifier)).not.toThrow();
  });

  it('should validate a STAT_BONUS modifier', () => {
    const modifier = {
      type: 'STAT_BONUS',
      target: 'dexterity',
      value: 2,
      title: 'Elven Agility',
      description: 'Elves are naturally agile',
      source: 'Elf Heritage',
    };

    expect(() => CharacterMofdifierSchema.parse(modifier)).not.toThrow();
  });

  it('should validate a FEATURE modifier', () => {
    const modifier = {
      type: 'FEATURE',
      target: '',
      title: 'Darkvision',
      description:
        'You can see in dim light within 60 feet as if it were bright light',
    };

    expect(() => CharacterMofdifierSchema.parse(modifier)).not.toThrow();
  });

  it('should require type field', () => {
    const modifier = {
      target: 'strength',
      value: 2,
    };

    expect(() => CharacterMofdifierSchema.parse(modifier)).toThrow();
  });

  it('should reject invalid type', () => {
    const modifier = {
      type: 'INVALID_TYPE',
      target: 'strength',
      value: 2,
    };

    expect(() => CharacterMofdifierSchema.parse(modifier)).toThrow();
  });

  it('should default target to empty string', () => {
    const modifier = {
      type: 'FEATURE',
      title: 'Lucky',
    };

    const parsed = CharacterMofdifierSchema.parse(modifier);
    expect(parsed.target).toBe('');
  });
});

describe('CharacterFeatureSchema', () => {
  it('should validate a complete feature with modifiers', () => {
    const feature = {
      key: 'elf-heritage',
      characterBuilderKey: 'dnd5e-builder',
      name: 'Elf',
      modifiers: [
        {
          type: 'STAT_BONUS',
          target: 'dexterity',
          value: 2,
          title: 'Elven Agility',
          description: 'Your dexterity score increases by 2',
        },
        {
          type: 'FEATURE',
          target: '',
          title: 'Darkvision',
          description: 'You can see in dim light within 60 feet',
        },
      ],
    };

    expect(() => CharacterFeatureSchema.parse(feature)).not.toThrow();
  });

  it('should validate a minimal feature', () => {
    const feature = {
      name: 'Human',
    };

    const parsed = CharacterFeatureSchema.parse(feature);
    expect(parsed.key).toBe('');
    expect(parsed.characterBuilderKey).toBe('');
    expect(parsed.name).toBe('Human');
    expect(parsed.modifiers).toBeUndefined();
  });

  it('should validate a class feature with multiple modifiers', () => {
    const feature = {
      key: 'fighter-class',
      characterBuilderKey: 'dnd5e-builder',
      name: 'Fighter',
      modifiers: [
        {
          type: 'BASE_STAT',
          target: 'hit_die',
          value: 10,
          title: 'Hit Die',
          description: 'Fighter hit die is d10',
        },
        {
          type: 'STAT_BONUS',
          target: 'proficiency_bonus',
          value: 2,
          title: 'Proficiency Bonus',
          description: 'Starting proficiency bonus',
        },
        {
          type: 'FEATURE',
          target: '',
          title: 'Fighting Style',
          description:
            'Choose a fighting style that grants you benefits in combat',
        },
        {
          type: 'FEATURE',
          target: '',
          title: 'Second Wind',
          description: 'Regain hit points as a bonus action',
        },
      ],
    };

    expect(() => CharacterFeatureSchema.parse(feature)).not.toThrow();
  });
});

describe('CharacterBuilderStepSchema', () => {
  it('should validate a species selection step', () => {
    const step = {
      key: 'choose-species',
      name: 'Choose Your Species',
      description:
        "Select your character's species. This determines your racial traits and ability score improvements.",
      min: 1,
      max: 1,
      features: [
        {
          key: 'human',
          name: 'Human',
          modifiers: [
            {
              type: 'STAT_BONUS',
              target: 'all_stats',
              value: 1,
              title: 'Versatile',
              description: 'All ability scores increase by 1',
            },
          ],
        },
        {
          key: 'elf',
          name: 'Elf',
          modifiers: [
            {
              type: 'STAT_BONUS',
              target: 'dexterity',
              value: 2,
              title: 'Elven Agility',
            },
          ],
        },
      ],
    };

    expect(() => CharacterBuilderStepSchema.parse(step)).not.toThrow();
  });

  it('should validate a class selection step', () => {
    const step = {
      key: 'choose-class',
      name: 'Choose Your Class',
      description:
        'Your class determines your hit points, proficiencies, and special abilities.',
      features: [
        {
          key: 'fighter',
          name: 'Fighter',
          modifiers: [
            {
              type: 'BASE_STAT',
              target: 'hit_die',
              value: 10,
            },
          ],
        },
        {
          key: 'wizard',
          name: 'Wizard',
          modifiers: [
            {
              type: 'BASE_STAT',
              target: 'hit_die',
              value: 6,
            },
          ],
        },
      ],
    };

    const parsed = CharacterBuilderStepSchema.parse(step);
    expect(parsed.min).toBe(1);
    expect(parsed.max).toBe(1);
  });

  it('should validate a background selection step with multiple choices', () => {
    const step = {
      key: 'choose-background',
      name: 'Choose Your Background',
      description:
        'Your background reveals where you came from and your place in the world.',
      min: 1,
      max: 2,
      features: [
        {
          key: 'acolyte',
          name: 'Acolyte',
          modifiers: [
            {
              type: 'FEATURE',
              target: '',
              title: 'Shelter of the Faithful',
              description:
                'You and your companions can receive free healing at temples',
            },
          ],
        },
        {
          key: 'criminal',
          name: 'Criminal',
          modifiers: [
            {
              type: 'FEATURE',
              target: '',
              title: 'Criminal Contact',
              description:
                'You have a reliable contact in the criminal underworld',
            },
          ],
        },
      ],
    };

    expect(() => CharacterBuilderStepSchema.parse(step)).not.toThrow();
  });

  it('should require description field', () => {
    const step = {
      key: 'test-step',
      name: 'Test Step',
    };

    expect(() => CharacterBuilderStepSchema.parse(step)).toThrow();
  });

  it('should default key and name to empty string', () => {
    const step = {
      description: 'A test step',
    };

    const parsed = CharacterBuilderStepSchema.parse(step);
    expect(parsed.key).toBe('');
    expect(parsed.name).toBe('');
  });

  it('should default features to empty array', () => {
    const step = {
      key: 'test-step',
      name: 'Test Step',
      description: 'A test step',
    };

    const parsed = CharacterBuilderStepSchema.parse(step);
    expect(parsed.features).toEqual([]);
  });
});

describe('CharacterBuilderSchema', () => {
  it('should validate a complete D&D 5e character builder', () => {
    const builder: CharacterBuilder = {
      key: 'dnd5e-builder',
      name: 'D&D 5th Edition Character Creator',
      description: 'Create a character for Dungeons & Dragons 5th Edition',
      system: 'dnd5e',
      steps: [
        {
          key: 'choose-species',
          name: 'Choose Species',
          description: "Select your character's species",
          min: 1,
          max: 1,
          features: [
            {
              key: 'human',
              characterBuilderKey: 'dnd5e-builder',
              name: 'Human',
              modifiers: [
                {
                  type: 'STAT_BONUS',
                  target: 'all_stats',
                  value: 1,
                  title: 'Human Versatility',
                },
              ],
            },
          ],
        },
        {
          key: 'choose-class',
          name: 'Choose Class',
          description: "Select your character's class",
          min: 1,
          max: 1,
          features: [
            {
              key: 'fighter',
              characterBuilderKey: 'dnd5e-builder',
              name: 'Fighter',
              modifiers: [
                {
                  type: 'BASE_STAT',
                  target: 'hit_die',
                  value: 10,
                },
                {
                  type: 'FEATURE',
                  target: '',
                  title: 'Fighting Style',
                  description: 'Choose a fighting style',
                },
              ],
            },
          ],
        },
        {
          key: 'ability-scores',
          name: 'Assign Ability Scores',
          description: 'Distribute your ability scores among the six abilities',
          min: 6,
          max: 6,
          features: [
            {
              key: 'strength-score',
              characterBuilderKey: 'dnd5e-builder',
              name: 'Strength Score',
              modifiers: [
                {
                  type: 'BASE_STAT',
                  target: 'strength',
                  value: 15,
                },
              ],
            },
            {
              key: 'dexterity-score',
              characterBuilderKey: 'dnd5e-builder',
              name: 'Dexterity Score',
              modifiers: [
                {
                  type: 'BASE_STAT',
                  target: 'dexterity',
                  value: 14,
                },
              ],
            },
          ],
        },
      ],
    };

    expect(() => CharacterBuilderSchema.parse(builder)).not.toThrow();
  });

  it('should validate a minimal builder', () => {
    const builder = {
      name: 'Basic Builder',
    };

    const parsed = CharacterBuilderSchema.parse(builder);
    expect(parsed.key).toBe('');
    expect(parsed.description).toBe('');
    expect(parsed.system).toBe('');
    expect(parsed.steps).toEqual([]);
  });

  it('should validate a homebrew system builder', () => {
    const builder = {
      key: 'custom-fantasy-builder',
      name: 'Custom Fantasy RPG Builder',
      description: 'Create characters for our homebrew fantasy system',
      system: 'homebrew-fantasy',
      steps: [
        {
          key: 'choose-lineage',
          name: 'Choose Lineage',
          description: "Select your character's ancestral lineage",
          features: [
            {
              key: 'dragonborn',
              name: 'Dragonborn',
              modifiers: [
                {
                  type: 'STAT_BONUS',
                  target: 'constitution',
                  value: 2,
                  title: 'Draconic Resilience',
                },
                {
                  type: 'FEATURE',
                  target: '',
                  title: 'Breath Weapon',
                  description: 'You can exhale destructive energy',
                },
              ],
            },
          ],
        },
      ],
    };

    expect(() => CharacterBuilderSchema.parse(builder)).not.toThrow();
  });

  it('should handle complex multi-step builders', () => {
    const complexBuilder = {
      key: 'advanced-dnd-builder',
      name: 'Advanced D&D Character Builder',
      description: 'Full-featured D&D character creation with all options',
      system: 'dnd5e',
      steps: [
        {
          key: 'species-and-subrace',
          name: 'Species & Subrace',
          description: 'Choose your species and any applicable subrace',
          min: 1,
          max: 2,
          features: [
            {
              key: 'wood-elf',
              name: 'Wood Elf',
              modifiers: [
                {
                  type: 'STAT_BONUS',
                  target: 'dexterity',
                  value: 2,
                  source: 'Elf Heritage',
                },
                {
                  type: 'STAT_BONUS',
                  target: 'wisdom',
                  value: 1,
                  source: 'Wood Elf Heritage',
                },
                {
                  type: 'FEATURE',
                  target: '',
                  title: 'Keen Senses',
                  description: 'Proficiency with Perception',
                },
                {
                  type: 'FEATURE',
                  target: '',
                  title: 'Elf Weapon Training',
                  description:
                    'Proficiency with longswords, shortbows, and longbows',
                },
              ],
            },
          ],
        },
        {
          key: 'class-and-subclass',
          name: 'Class & Subclass',
          description: 'Choose your class and specialization',
          min: 1,
          max: 2,
          features: [
            {
              key: 'ranger-hunter',
              name: 'Ranger (Hunter)',
              modifiers: [
                {
                  type: 'BASE_STAT',
                  target: 'hit_die',
                  value: 10,
                },
                {
                  type: 'STAT_BONUS',
                  target: 'proficiency_bonus',
                  value: 2,
                },
                {
                  type: 'FEATURE',
                  target: '',
                  title: 'Favored Enemy',
                  description:
                    'Choose a creature type to specialize in hunting',
                },
                {
                  type: 'FEATURE',
                  target: '',
                  title: "Hunter's Prey",
                  description: 'Choose a Hunter archetype feature',
                },
              ],
            },
          ],
        },
      ],
    };

    expect(() => CharacterBuilderSchema.parse(complexBuilder)).not.toThrow();
    const parsed = CharacterBuilderSchema.parse(complexBuilder);
    expect(parsed.steps).toHaveLength(2);
    expect(parsed.steps[0].features[0].modifiers).toHaveLength(4);
  });
});
