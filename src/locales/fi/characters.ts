import type { Locale } from '@utils/i18n';

export const characters: Locale = {
  builder: {
    system: 'Järjestelmä',
    step: 'Vaihe',
    loading: 'Lataa hahmokonetta...',
    comingSoon: 'Hahmonluontitoiminnot tulossa pian...',
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
        edit: 'Muokkaa vaihtoehtoa',
        save: 'Tallenna ominaisuus',
        remove: 'Poista ominaisuus',
        moveUp: 'Siirrä ylös',
        moveDown: 'Siirrä alas',
        empty:
          'Tälle vaiheelle ei ole vielä lisätty ominaisuuksia. Voit lisätä niitä alta.',
        defaultName: 'Uusi ominaisuus',
        noModifiers: 'Ei määreitä',
        modifiersCount: 'Määreitä: {count}',
      },
      modifiers: {
        type: 'Tyyppi',
        target: 'Kohde',
        value: 'Arvo',
        description: 'Kuvaus',
      },
    },
    steps: {
      title: 'Hahmonluonnin Vaiheet',
      choose: 'Valitse {count}',
      chooseRange: 'Valitse {min}-{max}',
      featuresAvailable: '{count} ominaisuutta saatavilla',
      showFeatures: 'Näytä saatavilla olevat ominaisuudet',
      noSteps: 'Tälle hahmokonelle ei ole määritetty vaiheita',
    },
    actions: {
      title: 'Toiminnot',
      startBuilding: 'Aloita Hahmon Luominen',
      customize: 'Muokkaa Hahmokonetta',
      browse: 'Selaa Kaikkia Hahmokoneita',
    },
    stats: {
      title: 'Hahmokoneen Tiedot',
      steps: 'Vaiheita',
      totalFeatures: 'Ominaisuuksia Yhteensä',
      system: 'Järjestelmä',
    },
    modifiers: {
      count: '{count} määrettä',
    },
    notFound: {
      title: 'Hahmokonetta Ei Löytynyt',
      description:
        'Etsimääsi hahmokonetta ei löytynyt. Se saattaa olla poistettu tai sinulla ei ole lupaa tarkastella sitä.',
    },
    noBuilder: {
      title: 'Hahmokonetta Ei Valittu',
      description: 'Valitse hahmokone aloittaaksesi hahmojen luomisen.',
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
    list: {
      title: 'Hahmokoneet',
    },
    title: 'Hahmokone',
  },
};
