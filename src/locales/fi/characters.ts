import type { Locale } from '@utils/i18n';

export const characters: Locale = {
  character: {
    title: 'Hahmot',
    description:
      'Hahmot ovat pelin pelaajien luomia pelihahmoja. Ne voivat sisältää tietoja, kuten nimen, kuvauksen ja hahmolomakkeen.',
  },
  create: {
    title: 'Luo hahmo',
    description: 'Valitse alta hahmolomake, jota haluat käyttää. ',
    noSheet: 'Ei hahmolomaketta (vain nimi ja kuvaus)',
  },
  edit: {},
  sheets: {
    editor: {
      info: {
        title: 'Lomakkeen tiedot',
      },
    },
    select: {
      label: 'Hahmolomake',
      none: 'Ei lomaketta',
      loading: 'Ladataan hahmolomakkeita...',
      empty: 'Ei hahmolomakkeita saatavilla.',
    },
    fields: {
      name: 'Lomakkeen nimi',
    },
    placeholders: {
      name: 'Esim. D&D 5e Taistelijat',
    },
  },
};
