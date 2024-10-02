import type { Locale } from '../../utils/i18n';
import { actions } from './actions';
import { entries } from './entries';
import { library } from './library';
import { login } from './login';
import { meta } from './meta';
import { navigation } from './navigation';
import { settings } from './settings';
import { site } from './site';
import { social } from './social';
import { threads } from './threads';

export const fi: Locale = {
  app: {
    title: 'Pelilauta 2 - Versio 16 - Alfajulkaisu',
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
    },
    settings: {
      title: 'Asetukset',
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
};
