import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { type Component, For, createMemo } from 'solid-js';
import { updateSite } from 'src/stores/activeSiteStore';
import { $pages } from 'src/stores/activeSiteStore/pagesStore';

export const SiteHomePageSelect: Component = () => {
  const pages = useStore($pages);

  const homePageOptions = createMemo(() => {
    return pages().map((page) => ({
      value: page.key,
      title: page.name,
    }));
  });

  return (
    <label>
      {t('entries:site.homePage')}
      <select
        onchange={(event) => {
          updateSite({ homepage: event.target.value });
        }}
      >
        <For each={homePageOptions()}>
          {(option) => <option value={option.value}>{option.title}</option>}
        </For>
      </select>
    </label>
  );
};
