/**
 * A solid-js component to manage the table of contents for a site.
 */

import type { CnListItem } from '@11thdeg/cyan-next';
import { SortableList } from '@client/shared/SortableList';
import { db } from '@firebase/client';
import { useStore } from '@nanostores/solid';
import {
  SITES_COLLECTION_NAME,
  type Site,
  type SiteSortOrder,
} from '@schemas/SiteSchema';
import type { CategoryRef } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { doc, updateDoc } from 'firebase/firestore';
import { type Component, createSignal } from 'solid-js';
import { SiteTocRegenSection } from '../SiteTocRegen';

export const SiteTocAdmin: Component<{ site: Site }> = (props) => {
  const uid = useStore($uid);
  const visible = () => props.site.owners.includes(uid());

  const [orderBy, setOrderBy] = createSignal<SiteSortOrder>(
    props.site.sortOrder,
  );
  const [categories, setCategories] = createSignal<Array<CategoryRef>>(
    props.site.pageCategories || [],
  );

  const hasChanged = () => {
    return (
      JSON.stringify(categories()) !==
        JSON.stringify(props.site.pageCategories) ||
      orderBy() !== props.site.sortOrder
    );
  };

  const categoryItems = () =>
    categories().map((cat) => ({
      key: cat.slug,
      title: cat.name,
    }));

  function addCategory(e: Event) {
    e.preventDefault();
    const formdata = new FormData(e.target as HTMLFormElement);
    const newCat = formdata.get('newCategory') as string;
    if (newCat) {
      setCategories([
        ...categories(),
        { name: newCat, slug: newCat.toLowerCase().replace(/ /g, '-') },
      ]);
    }
  }

  async function reorderCategories(newOrder: Array<CnListItem>) {
    const cats = newOrder.map((item) => ({
      name: item.title,
      slug: item.key,
    }));
    setCategories(cats);
  }

  async function saveToDB() {
    const siteRef = doc(db, SITES_COLLECTION_NAME, props.site.key);
    await updateDoc(siteRef, {
      sortOrder: orderBy(),
      pageCategories: categories(),
    });
    window.location.reload();
  }

  function onOrderByChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    setOrderBy(target.value as SiteSortOrder);
  }

  function reset() {
    setCategories(props.site.pageCategories || []);
    setOrderBy(props.site.sortOrder);
  }

  return visible() ? (
    <div>
      <h3>
        <cn-icon noun="tools" />
        &nbsp;
        {t('site:toc.admin.title')}
      </h3>

      <section class="elevation-1 p-2 border-radius">
        <label>
          {t('entries:site.sortOrder')}
          <select value={orderBy()} onChange={onOrderByChange}>
            <option value="name">{t('entries:site.sortOrders.name')}</option>
            <option value="createdAt">
              {t('entries:site.sortOrders.createdAt')}
            </option>
            <option value="flowTime">
              {t('entries:site.sortOrders.flowTime')}
            </option>
            <option value="manual">
              {t('entries:site.sortOrders.manual')}
            </option>
          </select>
        </label>

        <div>
          <h4>{t('site:toc.admin.categories.title')}</h4>

          <SortableList
            items={categoryItems()}
            onItemsChanged={reorderCategories}
            delete
          />

          <form class="toolbar" onsubmit={addCategory}>
            <div class="grow">
              <input
                type="text"
                placeholder={t('site:toc.admin.newCategory')}
                name="newCategory"
              />
            </div>
            <button type="submit">
              <cn-icon noun="add" />
            </button>
          </form>
        </div>

        <div class="toolbar">
          <button
            type="button"
            class="text"
            disabled={!hasChanged()}
            onClick={reset}
          >
            {t('actions:reset')}
          </button>

          <button type="button" disabled={!hasChanged()} onClick={saveToDB}>
            {t('actions:save')}
          </button>
        </div>
      </section>

      <SiteTocRegenSection site={props.site} />
    </div>
  ) : null;
};
