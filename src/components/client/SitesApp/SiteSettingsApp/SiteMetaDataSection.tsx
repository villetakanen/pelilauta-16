import type { CyanToggleButton } from '@11thdeg/cyan-next';
import type { Site } from '@schemas/SiteSchema';
import { systemToNounMapping } from '@schemas/nouns';
import { updateSite } from '@stores/SitesApp';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';
import { SiteHomePageSelect } from './SiteHomePageSelect';

export const SiteMetaDataSection: Component<{ site: Site }> = (props) => {
  async function onBlur(field: string, value: string) {
    // Update the site
    updateSite({ [field]: value }, props.site.key);
  }

  return (
    <section>
      <h2>{t('site:settings.meta.title')}</h2>

      <h3>{t('site:settings.meta.configuration')}</h3>
      <fieldset>
        <cn-toggle-button
          label={t('entries:site.customPageKeys')}
          pressed={props.site.customPageKeys}
          onChange={(event: Event) =>
            updateSite(
              {
                customPageKeys: (event.target as CyanToggleButton).pressed,
              },
              props.site.key,
            )
          }
        />
        <SiteHomePageSelect site={props.site} />
      </fieldset>
    </section>
  );
};
