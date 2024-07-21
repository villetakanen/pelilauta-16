import type { Locale } from '@utils/i18n';

export const site: Locale = {
  toc: {
    title: 'Hakemisto',
    missing:
      'Sivusto on luotu ennen Pelilaudan versiota 16, joten sivuston hakemisto on luotava uudestaan',
    repair: 'Luo hakemisto',
  },
  settings: {
    title: 'Asetukset',
    meta: {
      title: 'Sivuston tiedot',
      configuration: 'Asetukset',
    },
    theming: {
      title: 'Ulkoasu',
    },
  },
  contents: {
    title: 'Sivut',
  },
  tray: {
    actions: {
      homepage: 'Etusivu',
      toc: 'Hakemisto',
    },
  },
  create: {
    title: 'Luo sivusto',
  },
  dangerZone: {
    title: 'Poista sivusto',
    description:
      'Tämä toiminto poistaa sivuston lopullisesti. Toimintoa ei voi peruuttaa. Vahvistaaksesi toiminnon, kirjoita alla olevaan kenttään "Olen Aivan Varma" ja paina "Poista sivusto" -painiketta.',
    deleteSiteAction: 'Poista sivusto',
  },
};
