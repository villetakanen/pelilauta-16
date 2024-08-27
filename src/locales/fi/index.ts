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
      title: 'Pelilauta 2 16α',
      description:
        'Pelilauta 2 - Versio 16α – SSR tuella varustettu versio Pelilaudasta. Hyvin varhainen julkaisu, suurin osa toiminnoista puuttuu',
      version: 'Versio',
      source: 'Koodi',
      dangerZone: 'Vaaravyöhyke',
    },
    docs: {
      title: 'Pelilauta',
    },
    settings: {
      title: 'Asetukset',
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
