import type { Locale } from '@utils/i18n';

export const characters: Locale = {
  builder: {
    editor: {
      info: {
        title: 'Hahmokone',
        noBuilder: 'Hahmokonetta ei löytynyt',
      },
      steps: {
        title: 'Vaiheet',
        add: 'Uusi vaihe',
        edit: 'Muokkaa vaihetta',
        save: 'Tallenna vaihe',
        remove: 'Poista vaihe',
        ascend: 'Siirrä ylös',
        descend: 'Siirrä alas',
      },
      features: {
        title: 'Valittavissa',
        edit: 'Muokkaa ominaisuutta',
        save: 'Tallenna ominaisuus',
        remove: 'Poista ominaisuus',
        moveUp: 'Siirrä ylös',
        moveDown: 'Siirrä alas',
        empty:
          'Tälle vaiheelle ei ole vielä lisätty ominaisuuksia. Voit lisätä niitä alta.',
        defaultName: 'Uusi ominaisuus',
        noModifiers: 'Ei muokkaimia määritetty',
        modifiersCount: 'Muokkaimia: {count}',
      },
    },
    fields: {
      name: 'Nimi',
      description: 'Kuvaus',
      namePlaceholder: 'Kirjoita nimi...',
      descriptionPlaceholder: 'Kirjoita kuvaus...',
    },
    snacks: {
      saved: 'Hahmokone tallennettu onnistuneesti',
      saveError: 'Hahmokoneen tallentaminen epäonnistui',
    },
  },
};
