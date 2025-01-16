import type { Locale } from '../../utils/i18n';
import { actions } from './actions';
import { entries } from './entries';
import { library } from './library';
import { login } from './login';
import { meta } from './meta';
import { navigation } from './navigation';
import { profile } from './profile';
import { settings } from './settings';
import { site } from './site';
import { social } from './social';
import { tag } from './tag';
import { threads } from './threads';

export const fi: Locale = {
  app: {
    forbidden: {
      title: 'Hups!',
      message: 'Tämä sivu vaatii kirjautumisen pelilaudalle.',
    },
    title: 'Pelilauta 2 - Versio 16',
    shortname: 'Pelilauta 2',
    mekanismi: 'Mekanismi',
    meta: {
      title: 'Pelilauta 2 16 [RC]',
      description:
        'Pelilauta 2 - Versio 16 [RC] – Roolipelikeskustelut, sivustot, wikit ja muuta sellaista',
      version: 'Versio',
      source: 'Koodi',
      dangerZone: 'Vaaravyöhyke',
    },
    docs: {
      title: 'Pelilauta',
    },
    footer: {
      partners: {
        title: 'Yhteistyössä',
      },
      links: {
        title: 'Roolipelit verkossa',
      },
      activeUsers: {
        title: 'Aktiivisena',
      },
    },
    settings: {
      title: 'Asetukset',
    },
    onboarding: {
      title: 'Tervetuloa!',
      text: 'Voit luoda Pelilaudalle oman sivuston pelillesi, ja osallistautua keskusteluihin kirjautumalla ensin tästä.',
    },
    '404': {
      title: 'Hups!',
      subtitle: '404 - Tämä polku ei vie mihinkään.',
      info: 'Ehkä löydät etsimäsi seuraavien linkkien avulla:',
      'go-home': 'Etusivu',
      'go-sites': 'Julkisten pelien ja sivustojen listaus',
      'go-threads': 'Keskustelualueet',
    },
  },
  login,
  actions,
  settings,
  entries,
  meta,
  navigation,
  library,
  site,
  social,
  threads,
  tag,
  profile,
};
