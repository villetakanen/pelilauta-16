import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { type Component, For, createMemo } from 'solid-js';
import { updateSite } from 'src/stores/SiteApp';
import { $pages } from 'src/stores/SiteApp/pagesStore';

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
        <option value="">{t('entries:default')}</option>
        <For each={homePageOptions()}>
          {(option) => <option value={option.value}>{option.title}</option>}
        </For>
      </select>
    </label>
  );
};
