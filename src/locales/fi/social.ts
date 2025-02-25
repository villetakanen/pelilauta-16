import type { Locale } from '@utils/i18n';

export const social: Locale = {
  inbox: {
    title: 'Tapahtumat',
    notificationCount: 'uutta tapahtumaa',
    description:
      'Viimeaikaiset tapahtumat. Yli 30pv vanhat tapahtumat poistetaan ajoittain automatiikan toimesta.',
  },
  notification: {
    reply: {
      loved: 'tykkäsi kommentista',
    },
    thread: {
      loved: 'tykkäsi ketjusta',
    },
    handout: {
      update: 'päivitti salaisuuttasi',
    },
  },
};
