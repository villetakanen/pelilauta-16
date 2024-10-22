/**
 * A solid-js component to manage the table of contents for a site.
 */

import type { CnListItem } from '@11thdeg/cyan-next';
import { SortableList } from '@client/shared/SortableList';
import { db } from '@firebase/client';
import { useStore } from '@nanostores/solid';
import { SITES_COLLECTION_NAME, type Site } from '@schemas/SiteSchema';
import type { CategoryRef } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { doc, updateDoc } from 'firebase/firestore';
import { type Component, createSignal } from 'solid-js';
import { SiteTocRegenSection } from './SiteTocRegen';

export const SiteTocAdmin: Component<{ site: Site }> = (props) => {
  const uid = useStore($uid);
  const visible = () => props.site.owners.includes(uid());
  const [categories, setCategories] = createSignal<Array<CategoryRef>>(
    props.site.pageCategories || [],
  );
  const [newCategory, setNewCategory] = createSignal('');

  const hasChanged = () => {
    return (
      JSON.stringify(categories()) !== JSON.stringify(props.site.pageCategories)
    );
  };

  const categoryItems = () =>
    categories().map((cat) => ({
      key: cat.slug,
      title: cat.name,
    }));

  async function addCategory() {
    if (!newCategory()) return;
    const cats = [...categories()];
    cats.push({
      name: newCategory(),
      slug: newCategory().toLowerCase().replace(/ /g, '-'),
    });
    setCategories(cats);
    /*const siteRef = doc(db, SITES_COLLECTION_NAME, props.site.key);
    await updateDoc(siteRef, { pageCategories: cats });
    logDebug('Added category', newCategory());
    window.location.reload();*/
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
    await updateDoc(siteRef, { pageCategories: categories() });
    logDebug('Saved categories', categories());
    window.location.reload();
  }

  return visible() ? (
    <div class="elevation-1 p-1 border-radius">
      <h3>
        <cn-icon noun="tools" />
        &nbsp;
        {t('site:toc.admin.title')}
      </h3>
      <SortableList
        items={categoryItems()}
        onItemsChanged={reorderCategories}
        delete
      />
      <div class="toolbar">
        <div class="grow">
          <input
            type="text"
            placeholder={t('site:toc.admin.newCategory')}
            value={newCategory()}
            onInput={(e) =>
              setNewCategory((e.target as HTMLInputElement).value)
            }
          />
        </div>
        <button type="button" onClick={addCategory}>
          <cn-icon noun="add" />
        </button>
      </div>

      <div class="toolbar">
        <button type="button" disabled={!hasChanged()} onClick={saveToDB}>
          {t('save')}
        </button>
      </div>

      <SiteTocRegenSection site={props.site} />
    </div>
  ) : null;
};
