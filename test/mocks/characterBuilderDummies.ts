import type {
  CharacterBuilder,
  CharacterBuilderStep,
  CharacterFeature,
} from '@schemas/CharacterBuilderSchema';

/**
 * Dummy Character Features
 */
export const humanFeature: CharacterFeature = {
  key: 'human',
  name: 'Human',
  modifiers: [
    {
      type: 'STAT_BONUS',
      target: 'all_ability_scores',
      value: 1,
      title: 'Human Versatility',
      description: 'Humans are adaptable and gain +1 to all ability scores',
      source: 'Human Heritage',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Extra Language',
      description: 'You know one additional language of your choice',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Extra Skill',
      description: 'You gain proficiency in one skill of your choice',
    },
  ],
};

export const elfFeature: CharacterFeature = {
  key: 'elf',
  name: 'Elf',
  modifiers: [
    {
      type: 'STAT_BONUS',
      target: 'dexterity',
      value: 2,
      title: 'Elven Grace',
      description: 'Your dexterity score increases by 2',
      source: 'Elven Heritage',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Darkvision',
      description:
        'You can see in dim light within 60 feet of you as if it were bright light',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Keen Senses',
      description: 'You have proficiency with the Perception skill',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Fey Ancestry',
      description: 'You have advantage on saving throws against being charmed',
    },
  ],
};

export const dwarfFeature: CharacterFeature = {
  key: 'dwarf',
  name: 'Dwarf',
  modifiers: [
    {
      type: 'STAT_BONUS',
      target: 'constitution',
      value: 2,
      title: 'Dwarven Toughness',
      description: 'Your constitution score increases by 2',
      source: 'Dwarven Heritage',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Darkvision',
      description:
        'You can see in dim light within 60 feet of you as if it were bright light',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Dwarven Resilience',
      description: 'You have advantage on saving throws against poison',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Stonecunning',
      description:
        "You have proficiency with mason's tools and double proficiency on History checks related to stonework",
    },
  ],
};

export const warriorFeature: CharacterFeature = {
  key: 'warrior',
  name: 'Warrior',
  modifiers: [
    {
      type: 'BASE_STAT',
      target: 'hit_die',
      value: 10,
      title: 'Warrior Hit Die',
      description: 'Warriors use a d10 for hit points',
    },
    {
      type: 'BASE_STAT',
      target: 'base_attack_bonus',
      value: 1,
      title: 'Base Attack Bonus',
      description: 'Warriors have the best base attack bonus progression',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Weapon Mastery',
      description: 'You are proficient with all simple and martial weapons',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Armor Training',
      description: 'You are proficient with all armor and shields',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Combat Expertise',
      description:
        'You gain a fighting style that enhances your combat abilities',
    },
  ],
};

export const rogueFeature: CharacterFeature = {
  key: 'rogue',
  name: 'Rogue',
  modifiers: [
    {
      type: 'BASE_STAT',
      target: 'hit_die',
      value: 8,
      title: 'Rogue Hit Die',
      description: 'Rogues use a d8 for hit points',
    },
    {
      type: 'BASE_STAT',
      target: 'skill_points_per_level',
      value: 8,
      title: 'Skill Points',
      description: 'Rogues get the most skill points per level',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Sneak Attack',
      description:
        'You can deal extra damage when you have advantage on an attack',
    },
    {
      type: 'FEATURE',
      target: '',
      title: "Thieves' Tools",
      description: "You are proficient with thieves' tools",
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Stealth Expertise',
      description:
        'You have expertise in Stealth, doubling your proficiency bonus',
    },
  ],
};

export const wizardFeature: CharacterFeature = {
  key: 'wizard',
  name: 'Wizard',
  modifiers: [
    {
      type: 'BASE_STAT',
      target: 'hit_die',
      value: 6,
      title: 'Wizard Hit Die',
      description: 'Wizards use a d6 for hit points',
    },
    {
      type: 'BASE_STAT',
      target: 'spells_per_day_level_1',
      value: 3,
      title: 'First Level Spells',
      description: 'Number of 1st level spells you can cast per day',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Spellcasting',
      description:
        'You can cast wizard spells using Intelligence as your spellcasting ability',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Spellbook',
      description: 'You have a spellbook containing your known spells',
    },
    {
      type: 'FEATURE',
      target: '',
      title: 'Arcane Recovery',
      description:
        'You can recover some expended spell slots during a short rest',
    },
  ],
};

/**
 * Character Builder Steps
 */
export const chooseSpeciesStep: CharacterBuilderStep = {
  key: 'choose-species',
  name: 'Choose Your Species',
  description:
    "Select your character's species. This determines your natural abilities, physical traits, and cultural background. Each species provides different ability score improvements and special features.",
  min: 1,
  max: 1,
  features: [humanFeature, elfFeature, dwarfFeature],
};

export const chooseClassStep: CharacterBuilderStep = {
  key: 'choose-class',
  name: 'Choose Your Class',
  description:
    "Select your character's class. This determines your role in the party, your hit points, your skills, and your special abilities. Your class defines what you can do in combat and exploration.",
  min: 1,
  max: 1,
  features: [warriorFeature, rogueFeature, wizardFeature],
};

/**
 * Complete Character Builder
 */
export const basicFantasyCharacterBuilder: CharacterBuilder = {
  key: 'basic-fantasy-builder',
  name: 'Basic Fantasy RPG Character Creator',
  description:
    'Create a character for Basic Fantasy RPG. This streamlined system focuses on classic fantasy archetypes with simple, elegant mechanics. Perfect for new players and classic dungeon-crawling adventures.',
  system: 'basic-fantasy',
  steps: [chooseSpeciesStep, chooseClassStep],
};

/**
 * Extended Character Builder with more steps
 */
export const extendedFantasyCharacterBuilder: CharacterBuilder = {
  key: 'extended-fantasy-builder',
  name: 'Extended Fantasy Character Creator',
  description:
    'A more comprehensive character creation system with additional customization options including backgrounds and equipment choices.',
  system: 'extended-fantasy',
  steps: [
    chooseSpeciesStep,
    chooseClassStep,
    {
      key: 'choose-background',
      name: 'Choose Your Background',
      description:
        "Select your character's background. This represents your life before becoming an adventurer and provides additional skills, equipment, and story hooks.",
      min: 1,
      max: 1,
      features: [
        {
          key: 'soldier',
          name: 'Soldier',
          modifiers: [
            {
              type: 'FEATURE',
              target: '',
              title: 'Military Rank',
              description:
                'You have a military rank from your career as a soldier',
            },
            {
              type: 'FEATURE',
              target: '',
              title: 'Athletics Training',
              description: 'You have proficiency in Athletics',
            },
          ],
        },
        {
          key: 'scholar',
          name: 'Scholar',
          modifiers: [
            {
              type: 'FEATURE',
              target: '',
              title: 'Academic Network',
              description:
                'You have contacts in academic and research institutions',
            },
            {
              type: 'FEATURE',
              target: '',
              title: 'Research Skills',
              description:
                'You have proficiency in Investigation and one other Intelligence-based skill',
            },
          ],
        },
        {
          key: 'merchant',
          name: 'Merchant',
          modifiers: [
            {
              type: 'FEATURE',
              target: '',
              title: 'Trade Contacts',
              description:
                'You have a network of merchants and suppliers across the region',
            },
            {
              type: 'FEATURE',
              target: '',
              title: 'Business Acumen',
              description: 'You have proficiency in Insight and Persuasion',
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Exported collections for easy testing
 */
export const allSpeciesFeatures = [humanFeature, elfFeature, dwarfFeature];
export const allClassFeatures = [warriorFeature, rogueFeature, wizardFeature];
export const allCharacterBuilders = [
  basicFantasyCharacterBuilder,
  extendedFantasyCharacterBuilder,
];

/**
 * Helper function to create a simple character build selection
 */
export function createSimpleCharacterBuild() {
  return {
    builder: basicFantasyCharacterBuilder,
    selectedFeatures: [
      humanFeature, // Species choice
      warriorFeature, // Class choice
    ],
  };
}

/**
 * Helper function to create a complex character build selection
 */
export function createComplexCharacterBuild() {
  return {
    builder: extendedFantasyCharacterBuilder,
    selectedFeatures: [
      elfFeature, // Species choice
      rogueFeature, // Class choice
      // Background choice (scholar)
      {
        key: 'scholar',
        name: 'Scholar',
        modifiers: [
          {
            type: 'FEATURE',
            target: '',
            title: 'Academic Network',
            description:
              'You have contacts in academic and research institutions',
          },
          {
            type: 'FEATURE',
            target: '',
            title: 'Research Skills',
            description:
              'You have proficiency in Investigation and one other Intelligence-based skill',
          },
        ],
      },
    ],
  };
}
