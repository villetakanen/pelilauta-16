import type { Locale } from '../../utils/i18n';
import { actions } from './actions';
import { entries } from './entries';
import { login } from './login';
import { settings } from './settings';

export const fi: Locale = {
  app: {
    title: 'Pelilauta 2 - Versio 16 - Alfajulkaisu',
    meta: {
      title: 'Pelilauta 2 16α',
      description:
        'Pelilauta 2 - Versio 16α – SSR tuella varustettu versio Pelilaudasta. Hyvin varhainen julkaisu, suurin osa toiminnoista puuttuu',
    },
  },
  login,
  actions,
  settings,
  entries,
};
