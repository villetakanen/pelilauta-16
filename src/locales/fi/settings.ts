import type { Locale } from '@utils/i18n';
import { auth } from 'src/firebase/client';

export const settings: Locale = {
  personal: {
    title: 'Omat tiedot',
  },
  profile: {
    title: 'Profiili',
    info: 'Pelilauta tallentaa seuraavat tiedot tietokantaansa. Tiedot näkyvät sovelluksen valvojille, ja ne voivat näkyä sovelluksen käyttäjlle.',
    dangerZone: {
      title: 'Vaaravyöhyke',
      info: 'Seuraavat toiminnot poistavat tilisi ja profiilisi tiedot tietokannasta. Tämä toimintoa ei voi peruuttaa.',
      confirm: 'Kirjoita alle "olen aivan varma" jatkaaksesi ',
    },
  },
  publicprofile: {
    title: 'Yleiset',
    legend: 'Profiilin julkiset tiedot',
  },
  authz: {
    title: 'Kirjautumistiedot',
    info: 'Kirjautumisessa käyttämäsi palvelun (Google, Facebook tai sähköposti) pelilaudalle luovuttamat yksityistiedot. Nämä tiedot on tallennettu Pelilaudan Firebese-tunnestetietoihin. Tietoja ei tallenneta sovelluksen tietokantaan, eivätkä ne näy sovelluksen käyttäjille',
    fields: {
      uid: 'uid',
      displayName: 'Näyttönimi (displayName)',
      email: 'Sähköposti (email)',
      avatarURL: 'Avatar-URL (photoURL)',
    },
    updateAvatar: 'Päivitä avatar',
  },
};
