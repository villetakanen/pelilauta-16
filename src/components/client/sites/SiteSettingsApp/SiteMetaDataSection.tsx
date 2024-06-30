import { useStore } from '@nanostores/solid';
import { systemToNounMapping } from '@schemas/nouns';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';
import { $site, updateSite } from 'src/stores/activeSiteStore';

export const SiteMetaDataSection: Component = () => {
  const site = useStore($site);

  async function onBlur(field: string, value: string) {
    // Update the site
    updateSite({ [field]: value });
  }

  return (
    <section>
      <h2>{t('site:settings.meta.title')}</h2>
      <fieldset>
        <label>
          {t('entries:site.name')}
          <input
            type="text"
            value={site().name}
            onblur={(event) => onBlur('name', event.target.value)}
          />
        </label>

        <label>
          {t('entries:site.description')}
          <textarea
            value={site().description}
            onblur={(event) => onBlur('description', event.target.value)}
          />
        </label>

        <label>
          {t('entries:site.system')}
          <select
            value={site().system}
            onchange={(event) => onBlur('system', event.target.value)}
          >
            <For each={Object.keys(systemToNounMapping)}>
              {(system) => (
                <option value={system}>{t(`meta:systems.${system}`)}</option>
              )}
            </For>
          </select>
        </label>
      </fieldset>

      <h3>{t('site:settings.meta.configuration')}</h3>
    </section>
  );
};
