import type { Locale } from '@utils/i18n';

export const characters: Locale = {
  builder: {
    editor: {
      info: {
        title: 'Character Basic Information',
      },
    },
    fields: {
      name: 'Name',
      description: 'Description',
      descriptionPlaceholder: 'Write character description...',
    },
    snacks: {
      saved: 'Character builder saved successfully',
      saveError: 'Failed to save character builder',
    },
  },
};
