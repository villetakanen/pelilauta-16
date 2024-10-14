import { SITE_SORT_ORDER_VALUES, type Site } from '@schemas/SiteSchema';
import { updateSite } from '@stores/SitesApp';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';

export const SiteSortOrderSelect: Component<{ site: Site }> = (props) => {
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
        value={props.site.sortOrder}
        onchange={(event) => {
          updateSite(
            { sortOrder: verifySortOrder(event.target.value) },
            props.site.key,
          );
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
