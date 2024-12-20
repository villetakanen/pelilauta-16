/**
 * A SolidJS component that renders a list of site.pageCategory objects,
 * and allows the user to select one for a page-editing form.
 */

import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { For } from 'solid-js';

interface PageCategorySelectProps {
  site: Site;
  pageCategory: string;
  setPageCategory: (category: string) => void;
}

export const PageCategorySelect = (props: PageCategorySelectProps) => {
  const { site, pageCategory, setPageCategory } = props;

  const visible = site.pageCategories && site.pageCategories.length > 0;

  return visible ? (
    <label>
      {t('entries:page.category')}
      <select
        id="pageCategory"
        value={pageCategory}
        onChange={(e) => setPageCategory(e.currentTarget.value)}
      >
        <option value="">{t('entries:page.defaults.category')}</option>
        <For each={site.pageCategories}>
          {(category) => (
            <option
              selected={category.slug === pageCategory}
              value={category.slug}
            >
              {category.name}
            </option>
          )}
        </For>
      </select>
    </label>
  ) : null;
};
