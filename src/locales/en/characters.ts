import type { Locale } from '@utils/i18n';

export const characters: Locale = {
  create: {
    title: 'Create Character',
    description: 'Choose a character builder to start creating your character.',
  },
  info: {
    title: 'About Character Creation',
    description:
      'Character builders help you create detailed characters for role-playing games. Each builder is tailored to a specific game system and provides step-by-step guidance through the character creation process.',
  },
  builder: {
    noBuilders: {
      title: 'No Character Builders Available',
      description:
        'There are currently no character builders available. Please check back later or contact an administrator.',
    },
    list: {
      title: 'Available Character Builders',
    },
    system: 'System',
    step: 'Step',
    loading: 'Loading character builder...',
    comingSoon: 'Character creation functionality coming soon...',
    editor: {
      info: {
        title: 'Character Basic Information',
        noBuilder: 'Builder not found',
      },
      steps: {
        title: 'Steps',
        add: 'New step',
        edit: 'Edit step',
        save: 'Save step',
        remove: 'Remove step',
        ascend: 'Move up',
        descend: 'Move down',
      },
      features: {
        title: 'Features',
        edit: 'Edit feature',
        save: 'Save feature',
        remove: 'Remove feature',
        moveUp: 'Move up',
        moveDown: 'Move down',
        empty: 'No features defined',
        defaultName: 'New feature',
        noModifiers: 'No modifiers defined',
        modifiersCount: 'Modifiers: {count}',
      },
    },
    steps: {
      title: 'Character Creation Steps',
      choose: 'Choose {count}',
      chooseRange: 'Choose {min}-{max}',
      featuresAvailable: '{count} features available',
      showFeatures: 'Show available features',
      noSteps: 'No steps defined for this builder',
    },
    actions: {
      title: 'Actions',
      startBuilding: 'Start Building Character',
      customize: 'Customize Builder',
      browse: 'Browse All Builders',
    },
    stats: {
      title: 'Builder Info',
      steps: 'Steps',
      totalFeatures: 'Total Features',
      system: 'System',
    },
    modifiers: {
      count: '{count} modifiers',
    },
    notFound: {
      title: 'Builder Not Found',
      description:
        "The character builder you're looking for could not be found. It may have been removed or you may not have permission to view it.",
    },
    noBuilder: {
      title: 'No Builder Selected',
      description: 'Select a character builder to start creating characters.',
    },
    fields: {
      name: 'Name',
      description: 'Description',
      characterSheet: 'Character Sheet',
      namePlaceholder: 'Enter name...',
      descriptionPlaceholder: 'Enter description...',
    },
    snacks: {
      saved: 'Character builder saved successfully',
      saveError: 'Failed to save character builder',
    },
  },
  sheet: {
    defaultName: 'Character Sheet',
  },
};
