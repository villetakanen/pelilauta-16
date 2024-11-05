import type { Locale } from '@utils/i18n';

export const site: Locale = {
  contents: {
    title: 'Sivut',
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
  snacks: {
    siteDeleted: 'Sivusto {name} poistettu',
    errorDeletingSite: 'Virhe poistettaessa sivustoa',
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
  editor: {
    title: 'Muokkaa sivua',
  },
  page: {
    migrateContentInfo:
      'Sivu on tehty aiemmalla versiolla pelilaudasta, ja sen sisältöä ei voi muokata ilman konversiota. Konversio voi joskus muuttaa sivun ulkoasua ja rakennetta.',
    migrateContent: 'Konvertoi',
    revisionCount: 'muokkausta',
    missing: 'Sivua ei löydy, voit luoda sen tästä',
  },
  frontPage: 'Etusivu',
  members: {
    title: 'Omistajat',
    add: 'Lisää omistaja',
  },
  siteList: {
    title: 'Julkiset sivustot',
  },
  toc: {
    title: 'Hakemisto',
    missing:
      'Sivusto on luotu ennen Pelilaudan versiota 16, joten sivuston hakemisto on luotava uudestaan',
    repair: 'Luo hakemisto',
    admin: {
      title: 'Hallinta',
      newCategory: 'Uusi kategoria',
      categories: {
        title: 'Kategoriat',
      },
    },
    regenerate: {
      info: 'Luo hakemisto uudelleen sivujen kategorioiden perusteella',
    },
    other: 'Luokittelemattomat',
    all: 'Sisältö',
    importExport: {
      title: 'Tuo ja vie',
      description:
        'Voit viedä koko sivuston sisällön markdown-muodossa zip-tiedostona. Sivujen metadata tallennetaan markdown frontmatter -muotoon.',
    },
  },
  deletePage: {
    info: 'Olet poistamassa sivua {name}. Toimintoa ei voi peruuttaa.',
  },
};
