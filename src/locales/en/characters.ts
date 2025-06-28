import type { Locale } from '@utils/i18n';

export const characters: Locale = {
  builder: {
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
    fields: {
      name: 'Name',
      description: 'Description',
      namePlaceholder: 'Enter name...',
      descriptionPlaceholder: 'Enter description...',
    },
    snacks: {
      saved: 'Character builder saved successfully',
      saveError: 'Failed to save character builder',
    },
  },
};
