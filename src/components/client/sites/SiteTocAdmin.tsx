/**
 * A solid-js component to manage the table of contents for a site.
 */

import { db } from '@firebase/client';
import { useStore } from '@nanostores/solid';
import { SITES_COLLECTION_NAME, type Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { doc, updateDoc } from 'firebase/firestore';
import { type Component, createSignal } from 'solid-js';

export const SiteTocAdmin: Component<{ site: Site }> = (props) => {
  const uid = useStore($uid);
  const visible = () => props.site.owners.includes(uid());
  const [newCategory, setNewCategory] = createSignal('');

  const categories = () =>
    props.site.pageCategories?.map((category) => ({
      key: category.slug,
      title: category.name,
    }));

  async function addCategory() {
    if (!newCategory()) return;
    const cats = [...(props.site.pageCategories || [])];
    cats.push({
      name: newCategory(),
      slug: newCategory().toLowerCase().replace(/ /g, '-'),
    });
    const siteRef = doc(db, SITES_COLLECTION_NAME, props.site.key);
    await updateDoc(siteRef, { pageCategories: cats });
    logDebug('Added category', newCategory());
    window.location.reload();
  }

  return visible() ? (
    <div>
      <h3>{t('site:toc.admin.title')}</h3>
      <cn-sortable-list items={categories()} />
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
    </div>
  ) : null;
};
