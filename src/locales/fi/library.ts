import type { Locale } from '@utils/i18n';
import { characters } from './characters';

export const library: Locale = {
  title: 'Kirjasto',
  description:
    'Pelauta.fi - Kirjasto. Omat pelisi, pelit joissa pelaat, ja sivustot joita ylläpidät',
  sites: {
    title: 'Pelit ja sivustot',
    count: '{count} sivustoa.',
  },
  characters: {
    title: 'Hahmot',
    description: 'Kokeelinen prototyyppi hahmojen hallintaan pelilaudalla',
  },
};
