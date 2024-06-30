import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $site, updateSite } from 'src/stores/activeSiteStore';

export const SiteMetaDataSection: Component = () => {
  const site = useStore($site);

  async function onBlur(field: string, value: string) {
    // Update the site
    updateSite({ [field]: value });
  }

  return (
    <section>
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
            onblur={(event) => onBlur('system', event.target.value)}
          >
            <option value="homebrew">Homebrew</option>
            <option value="dnd5e">D&D 5e</option>
            <option value="pf2e">Pathfinder 2e</option>
          </select>
        </label>
      </fieldset>
    </section>
  );
};
