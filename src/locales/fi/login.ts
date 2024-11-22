import type { Locale } from '@utils/i18n';

export const login: Locale = {
  title: 'Kirjaudu',
  info: 'Jos et ole aiemmin kirjautunut Pelilaudalle, luomme sinulle uuden tunnuksen automaattisesti.',
  withEmail: {
    title: 'Linkillä',
    info: 'Voit kirjautua sovellukseen sähköpostiosoitteen avulla. Syötä sähköpostiosoitteesi allaolevaan kenttään ja paina kirjaudu. Lähetämme sähköpostiisi maagisen linkin, jonka avulla voit kirjautua Pelilaudalle.',
    placeholder: 'Sähköpostiosoite',
    sent: 'Linkki lähetetty sähköpostiisi. Kirjaudu linkkiä klikkaamalla.',
  },
  withProvider: {
    title: 'Tunnuksella',
    info: 'Kirjaudu Pelilaudalle käyttämällä jonkin seuraavista palveluista tunnistautumista.',
  },
  withGoogle: {
    action: 'Google-tilillä',
  },
  eula: {
    title: 'Tervetuloa!',
    nickTaken: 'Tunnus on käytössä. Valitse toinen.',
    profileInfo:
      'Kun kirjaudut ensimmäistä kertaa Pelilaudalle, luomme sinulle profiilin. Profiilin avulla voit osallistua keskusteluihin ja jakaa sisältöä muiden käyttäjien kanssa.',
    decline: 'Keskeytä, ja kirjaudu ulos',
    accept: 'Hyväksy ja jatka',
  },
};
