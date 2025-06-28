import type { CharacterFeature } from '@schemas/CharacterBuilderSchema';
import { composeCharacterFeatures } from '@utils/shared/characters/builder/composeCharacterFeatures';
import { describe, expect, it } from 'vitest';
import {
  basicFantasyCharacterBuilder,
  createSimpleCharacterBuild,
  elfFeature,
  wizardFeature,
} from '../mocks/characterBuilderDummies';

// Helper type for backward compatibility with function expectations
type FeatureLike = Pick<
  CharacterFeature,
  'key' | 'name' | 'characterBuilderKey'
> & {
  modifiers?: Array<{
    type: 'BASE_STAT' | 'STAT_BONUS' | 'FEATURE';
    target: string;
    value?: number;
    title?: string;
    description?: string;
    source?: string;
  }>;
};

describe('composeCharacterFeatures', () => {
  it('should create a character sheet from simple character build', () => {
    const characterBuild = createSimpleCharacterBuild();
    const result = composeCharacterFeatures(
      characterBuild.builder,
      characterBuild.selectedFeatures as FeatureLike[],
      'Thorin Ironforge',
    );

    expect(result.name).toBe('Thorin Ironforge');
    expect(result.system).toBe('basic-fantasy');
    expect(result.stats).toHaveLength(3); // all_ability_scores + hit_die + base_attack_bonus
    expect(result.extras).toHaveLength(2); // human features + warrior features

    // Check for human stat bonus
    const abilityScoreBonus = result.stats.find(
      (s) => s.key === 'all_ability_scores',
    );
    expect(abilityScoreBonus?.value).toBe(1);

    // Check for warrior base stats
    const hitDie = result.stats.find((s) => s.key === 'hit_die');
    expect(hitDie?.value).toBe(10);

    const baseAttack = result.stats.find((s) => s.key === 'base_attack_bonus');
    expect(baseAttack?.value).toBe(1);

    // Check extras contain feature descriptions
    expect(result.extras[0].name).toBe('Human');
    expect(result.extras[0].modifiers).toHaveLength(2); // Extra Language + Extra Skill
    expect(result.extras[1].name).toBe('Warrior');
    expect(result.extras[1].modifiers).toHaveLength(3); // Weapon Mastery + Armor Training + Combat Expertise
  });

  it('should handle character without name', () => {
    const characterBuild = createSimpleCharacterBuild();
    const result = composeCharacterFeatures(
      characterBuild.builder,
      characterBuild.selectedFeatures as FeatureLike[],
    );

    expect(result.name).toBe('');
    expect(result.system).toBe('basic-fantasy');
  });

  it('should combine stat bonuses correctly', () => {
    const multiStatFeature: CharacterFeature = {
      key: 'multi-stat',
      characterBuilderKey: 'test-builder',
      name: 'Multi Stat Feature',
      modifiers: [
        {
          type: 'STAT_BONUS',
          target: 'strength',
          value: 2,
          title: 'Strength Boost',
        },
        {
          type: 'STAT_BONUS',
          target: 'strength',
          value: 1,
          title: 'Extra Strength',
        },
      ],
    };

    const characterBuild = {
      builder: basicFantasyCharacterBuilder,
      selectedFeatures: [multiStatFeature],
    };

    const result = composeCharacterFeatures(
      characterBuild.builder,
      characterBuild.selectedFeatures as FeatureLike[],
    );
    const strengthStat = result.stats.find((s) => s.key === 'strength');
    expect(strengthStat?.value).toBe(3); // 2 + 1
  });

  it('should handle features with only FEATURE modifiers', () => {
    const featureOnlyFeature: CharacterFeature = {
      key: 'pure-feature',
      characterBuilderKey: 'test-builder',
      name: 'Pure Feature',
      modifiers: [
        {
          type: 'FEATURE',
          title: 'Special Ability',
          description: 'You have a special ability',
        },
        {
          type: 'FEATURE',
          title: 'Another Ability',
          description: 'You have another ability',
        },
      ],
    };

    const characterBuild = {
      builder: basicFantasyCharacterBuilder,
      selectedFeatures: [featureOnlyFeature],
    };

    const result = composeCharacterFeatures(
      characterBuild.builder,
      characterBuild.selectedFeatures as FeatureLike[],
    );
    expect(result.stats).toHaveLength(0);
    expect(result.extras).toHaveLength(1);
    expect(result.extras[0].name).toBe('Pure Feature');
    expect(result.extras[0].modifiers).toHaveLength(2);
  });

  it('should handle features with no modifiers', () => {
    const noModifiersFeature: CharacterFeature = {
      key: 'no-mods',
      characterBuilderKey: 'test-builder',
      name: 'No Modifiers Feature',
    };

    const characterBuild = {
      builder: basicFantasyCharacterBuilder,
      selectedFeatures: [noModifiersFeature],
    };

    const result = composeCharacterFeatures(
      characterBuild.builder,
      characterBuild.selectedFeatures as FeatureLike[],
    );
    expect(result.stats).toHaveLength(0);
    expect(result.extras).toHaveLength(0);
  });

  it('should handle complex elf wizard combination', () => {
    const characterBuild = {
      builder: basicFantasyCharacterBuilder,
      selectedFeatures: [elfFeature, wizardFeature],
    };

    const result = composeCharacterFeatures(
      characterBuild.builder,
      characterBuild.selectedFeatures as FeatureLike[],
      'Elrond Starweaver',
    );

    expect(result.name).toBe('Elrond Starweaver');

    // Check elf dexterity bonus
    const dexterity = result.stats.find((s) => s.key === 'dexterity');
    expect(dexterity?.value).toBe(2);

    // Check wizard stats
    const hitDie = result.stats.find((s) => s.key === 'hit_die');
    expect(hitDie?.value).toBe(6);

    const spells = result.stats.find((s) => s.key === 'spells_per_day_level_1');
    expect(spells?.value).toBe(3);

    // Check that both feature types are in extras
    expect(result.extras).toHaveLength(2);
    const elfExtras = result.extras.find((e) => e.name === 'Elf');
    const wizardExtras = result.extras.find((e) => e.name === 'Wizard');

    expect(elfExtras).toBeDefined();
    expect(wizardExtras).toBeDefined();
    expect(elfExtras?.modifiers).toHaveLength(3); // Darkvision, Keen Senses, Fey Ancestry
    expect(wizardExtras?.modifiers).toHaveLength(3); // Spellcasting, Spellbook, Arcane Recovery
  });
});
