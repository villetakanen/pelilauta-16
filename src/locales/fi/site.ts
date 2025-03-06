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
  clocks: {
    title: 'Kellot',
    create: {
      preview: 'Esikatselu',
      default: 'Kello',
    },
    empty: 'Ei kelloja',
  },
  data: {
    title: 'Tuo & vie',
    description: 'Työkalut sivuston tietojen tuontiin ja vientiin',
    export: {
      title: 'Vie',
      asMarkdown: 'Markdown',
      asMarkdownDocument:
        'Sivuston voi viedä yhtenä pitkänä markdown-tiedostona. Tällöin sivut ladotaan peräkkäin yhteen tiedostoon, esimekiksi tulostamista, keinoälytyökaluja tai julkaisua ajatellen.',
    },
    actions: {
      asMarkdonwDocument: 'Vie .md -tiedostona',
    },
  },
  handouts: {
    title: 'Salaisuudet',
    description:
      'Sivustolle lisätty jaettu materiaali, joka on rajattu. Tämä listaus näkyy vain omistajille, mutta itse salaisuudet ovat jaettavissa suoralla linkillä muille.',
    create: {
      title: 'Luo salaisuus',
    },
    metadata: {
      title: 'Lukijat',
    },
    add: {
      reader: 'Lisää lukija',
    },
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
  members: {
    title: 'Jäsenet',
  },
  options: {
    title: 'Työkalut',
    description:
      'Pelilauta / Mekanismi sisältää joukon pelinjohtamisen ja pelaamisen avuksi tarkoitettuja työkaluja. Voit ottaa työkalut käyttöön alla olevilla painikkeilla.',
    useClocks: 'Kellot',
    useHandouts: 'Salaisuudet',
    useRecentChanges: 'Viimeisimmät muutokset -paneeli',
    useSidebar: 'Sivupalkki (Mekanismi SideBar)',
  },
  settings: {
    title: 'Asetukset',
    meta: {
      extra: 'Lisäasetukset',
      title: 'Sivuston tiedot',
      configuration: 'Asetukset',
      saved: 'Asetukset tallennettu',
    },
    theming: {
      title: 'Ulkoasu',
    },
  },
  snacks: {
    siteCreated: 'Sivusto {sitename} luotu',
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
      clocks: 'Kellot',
    },
  },
  create: {
    title: 'Luo sivusto',
    description:
      'Voit luoda Pelilaudalle uuden sivuston pelillesi tai kampanjallesi. Sivusto luodaan alla olevaan osoitteeseen, joka muodostetaan pelin nimestä tai automaattisesti.',
    url: 'URL',
    page: {
      title: 'Luo sivu',
      missing: 'Sivua {name} ei vielä ole olemassa, voit luoda sen alta.',
      duplicateKey: 'Sivu osoitteessa {key} on jo olemassa.',
      duplicateKeyLink: 'Avaa sivu',
    },
    system: {
      description:
        'Pelisi tai kampanjasi luokittelu. Käytetään pelien listauksessa ja sivuston ulkoasussa.',
    },
    errors: {
      reserved:
        'Sivuston osoite on varattu. Vaihda sivuston nimeä, tai luo sivu ilman luettavia osoitteita.',
    },
    hidden: {
      description:
        'Sivuston voi piilottaa julkisista listauksista, jolloin se näkyy listauksissa vain sivuston omistajille ja pelaajille. Sivuston sivuja voi tästä huolimatta jakaa suoralla osoitteella.',
    },
    plaintexturls: {
      description:
        'Voit ottaa luettavat osoitteet pois käytöstä, jolloin pelilauta muodostaa sivustolle ja sen sivuille automaattiset osoitteet. Tämä voi olla höydyllistä jos haluat tehdä sivustosta vaikeasti löydettävän.',
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
