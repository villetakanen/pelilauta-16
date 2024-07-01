import { useStore } from '@nanostores/solid';
import { SITE_SORT_ORDER_VALUES } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';
import { $site, updateSite } from 'src/stores/activeSiteStore';

export const SiteSortOrderSelect: Component = () => {
  const site = useStore($site);

  const sortOrderOptions = SITE_SORT_ORDER_VALUES.map((sortOrder) => ({
    value: sortOrder,
    title: t(`entries:site.sortOrders.${sortOrder}`),
  }));

  function verifySortOrder(
    sortOrder: string,
  ): 'name' | 'createdAt' | 'flowTime' | 'manual' {
    if (SITE_SORT_ORDER_VALUES.includes(sortOrder)) {
      return sortOrder as 'name' | 'createdAt' | 'flowTime' | 'manual';
    }
    return 'flowTime';
  }

  return (
    <label>
      {t('entries:site.sortOrder')}
      <select
        value={site().sortOrder}
        onchange={(event) => {
          updateSite({ sortOrder: verifySortOrder(event.target.value) });
        }}
      >
        <option value="">{t('entries:default')}</option>
        <For each={sortOrderOptions}>
          {(option) => <option value={option.value}>{option.title}</option>}
        </For>
      </select>
    </label>
  );
};
