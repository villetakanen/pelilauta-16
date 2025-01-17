import type { Locale } from '@utils/i18n';

export const site: Locale = {
  assets: {
    title: 'Lataukset',
    description: 'Sivustolle ladatut tiedostot',
    forbidden:
      'Koneellisen luvun ja tiedonkeruun estämiseksi lataukset-listaus vaatii kirjautumisen pelilaudalle. Voit kirjautua alla olevan painikkeen kautta.',
    upload: { success: '{file} ladattu onnistuneesti' },
  },
  contents: {
    title: 'Sivut',
  },
  import: {
    preview: {
      title: 'Esikatselu',
      description: 'Tuodaan {count} sivua',
      action: 'Toiminto',
      overwrite: 'Korvaa vanha',
      create: 'Luo uusi',
    },
    massImport: {
      description: 'Tuodaan {complete} / {count} sivua',
    },
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
    siteCreated: 'Sivusto {siteName} luotu',
    siteDeleted: 'Sivusto {name} poistettu',
    errorDeletingSite: 'Virhe poistettaessa sivustoa',
    pageCreated: 'Sivu luotu',
    pageUpdated: 'Sivun muutokset tallennettu',
  },
  tray: {
    actions: {
      homepage: 'Etusivu',
      toc: 'Hakemisto',
      assets: 'Lataukset',
    },
  },
  create: {
    title: 'Luo sivusto',
    page: {
      title: 'Luo sivu',
      missing: 'Sivua {name} ei vielä ole olemassa, voit luoda sen alta.',
    },
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
    editor: {
      contentMigrateWarning:
        'Sivun aiempi sisältö on konvertoitu markdown-muotoon',
    },
  },
  frontPage: 'Etusivu',
  owners: {
    title: 'Omistajat',
    description:
      'Sivuston omistajat voivat muokata sivuston asetuksia, sisältöä, käyttöoikeuksia ja ulkoasua.',
    add: 'Lisää omistaja',
  },
  players: {
    title: 'Pelaajat',
    description:
      'Sivustolle voidaan lisätä myös jäseniä, kuten pelaajia - joiden oikeudet ovat rajatummat. Oletuksena pelaaja voi vain muokata ja luoda sivuja.',
    add: 'Lisää pelaaja',
    usePlayers: 'Pelaajat -toiminto',
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
    import: {
      title: 'Tuo',
      description:
        'Voit tuoda sivuston sisällön markdown-muodossa. Ohjeita frontmatter-metadatasta löytyy dokumentaatiosta {link}.',
      fromFolder: 'Tuo kansio',
    },
  },
  deletePage: {
    info: 'Olet poistamassa sivua {name}. Toimintoa ei voi peruuttaa.',
  },
  latestChanges: {
    title: 'Muutokset',
  },
};
