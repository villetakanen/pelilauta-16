import type { Locale } from '@utils/i18n';

export const entries: Locale = {
  account: {
    lastLogin: 'Viimeisin kirjautuminen',
    lightMode: 'Tumma tila',
    uid: 'UID',
    updatedAt: 'Päivitetty',
    showAdminTools: 'Näytä admin-työkalut',
    language: 'Kieli',
  },
  profile: {
    key: 'Tunniste',
    nick: 'Nick',
    avatar: 'Avatar',
    bio: 'Kuvaus',
    username: 'Käyttäjätunnus',
  },
  site: {
    key: 'Avain',
    name: 'Nimi',
    description: 'Kuvaus',
    system: 'Peli, järjestelmä tai luokittelu',
    homePage: 'Etusivu',
    flowTime: 'Muutettu',
    sortOrder: 'Sivujen järjestys',
    sortOrders: {
      name: 'Aakkosjärjestyksessä',
      createdAt: 'Luomisajan mukaan',
      flowTime: 'Muokkausajan mukaan',
      manual: 'Kategorian mukaan',
    },
    avatarURL: 'Kuvake',
    posterURL: 'Kansikuva',
    backgroundURL: 'Taustakuva',
    hidden: 'Piilotettu sivusto',
    customPageKeys: 'Luettavat osoitteet',
  },
  thread: {
    title: 'Otsikko',
    channel: 'Aihe',
    placeholders: {
      title: 'Otsikko',
      content: 'Viesti...',
    },
    meta: {
      entryName: 'Viesti',
      entryNamePlural: 'Viestit',
    },
  },
  reply: {
    markdownContent: '...',
  },
  default: 'Oletus',
  page: {
    name: 'Sivun nimi',
    category: 'Luokka',
    markdownContent: 'Markdonwn',
    defaults: {
      name: '[Sivun nimi]',
      category: '-',
    },
  },
};
