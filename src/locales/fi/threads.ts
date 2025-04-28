import type { Locale } from '@utils/i18n';

export const threads: Locale = {
  fork: {
    title: 'Jaa uutena lankana',
    quoted: 'Lainaus',
    crossPost: 'Jatkoi keskustelua [uudessa langassa]({link}).',
  },
  info: {
    title: 'Tietoja',
    author: 'Kirjoittanut',
    inTopic: 'aiheessa',
    replies: '{count} vastausta',
    actions: {
      title: 'Toiminnot',
      admin: {
        title: 'Hallinta',
        repost: 'Jaa uudelleen',
      },
    },
  },
  quote: {
    fromThread: 'Lainaus keskustelusta',
  },
  tray: {
    title: 'Aiheet',
  },
  forum: {
    title: 'Foorumi',
    description:
      'Keskustelua roolipeleistä, pelinkehityksestä, ja muista roolipelaamiseen liittyvistä aiheista.',
  },
  channel: {
    page: 'Sivu',
    pageCount: 'sivua',
    toFirstPage: 'Ensimmäinen sivu <',
    nextPage: '> Seuraava sivu',
  },
  discussion: {
    title: 'Keskustelu',
    reply: 'Vastaa',
    empty: 'Aloita keskustelu aiheesta vastaamalla alta.',
    confirmDelete: {
      message: 'Oletko varma, että haluat poistaa tämän viestin?',
    },
  },
  confirmDelete: {
    title: 'Vahvista poisto',
    success: 'Keskustelu poistettu',
    message:
      'Oletko varma, että haluat poistaa tämän keskustelun pysyvästi. Keskustelua ei voi palauttaa.',
  },
  snacks: {
    replyDeleted: 'Viesti poistettu',
  },
};
