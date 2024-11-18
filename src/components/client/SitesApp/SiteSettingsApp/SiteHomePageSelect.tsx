import type { Site } from '@schemas/SiteSchema';
import { updateSite } from '@stores/SitesApp';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';

export const SiteHomePageSelect: Component<{ site: Site }> = (props) => {
  const homePageOptions = () =>
    props.site.pageRefs?.map((page) => ({
      value: page.key,
      title: page.name,
    }));

  return (
    <label>
      {t('entries:site.homePage')}
      <select
        onchange={(event) => {
          updateSite({ homepage: event.target.value }, props.site.key);
        }}
      >
        <option value="">{t('entries:default')}</option>
        <For each={homePageOptions()}>
          {(option) => (
            <option
              selected={option.value === props.site.homepage}
              value={option.value}
            >
              {option.title}
            </option>
          )}
        </For>
      </select>
    </label>
  );
};
