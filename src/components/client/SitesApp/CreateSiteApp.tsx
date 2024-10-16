import type { CyanToggleButton } from '@11thdeg/cyan-next';
import { WithLogin } from '@client/shared/WithLogin';
import { createSite } from '@firebase/client/site/createSite';
import { useStore } from '@nanostores/solid';
import { PAGES_COLLECTION_NAME } from '@schemas/PageSchema';
import { SITES_COLLECTION_NAME, parseSite } from '@schemas/SiteSchema';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';
import { t } from '@utils/i18n';
import { logError } from '@utils/logHelpers';
import { toMekanismiURI } from '@utils/mekanismiUtils';
import { generateFrontPage } from '@utils/siteUtils';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
} from 'solid-js';
import { db } from 'src/firebase/client';
import { $uid } from 'src/stores/sessionStore';
import { GameSystemSelect } from './GameSystemSelect';

export const CreateSiteApp: Component = () => {
  const uid = useStore($uid);
  const [siteName, setSiteName] = createSignal('');
  const [system, setSystem] = createSignal('homebrew');
  const [usePlainTextURL, setUsePlainTextURL] = createSignal(true);
  const [keyTaken, setKeyTaken] = createSignal(false);
  const [hidden, setHidden] = createSignal(false);
  const [takenKeys, setTakenKeys] = createSignal<string[]>([]);
  const proposedKey = createMemo(() =>
    usePlainTextURL() ? toMekanismiURI(siteName()) : '',
  );

  /**
   * Every time the proposed name changes, check if it is taken
   */
  createEffect(() => {
    if (takenKeys().includes(proposedKey())) {
      setKeyTaken(true);
    }
  });

  async function checkNameTaken() {
    // If the name is empty, firebase will auto-generate an unique key
    if (!proposedKey()) return;

    // If we are not using plain text urls, we don't need to check for duplicates
    if (!usePlainTextURL()) return;

    const key = proposedKey();

    const siteRef = await getDoc(doc(db, SITES_COLLECTION_NAME, key));
    if (siteRef.exists()) {
      setTakenKeys([...takenKeys(), key]);
      setKeyTaken(true);
      return true;
    }
    return false;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    // Check if the key is taken
    if (await checkNameTaken()) return;

    // Let's generate a key for the site
    const key = proposedKey();

    // Get the form data
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const site = parseSite(
        {
          name: siteName(),
          description: formData.get('description') as string,
          hidden: hidden(),
          customPageKeys: usePlainTextURL(),
          homepage: key,
          owners: [uid()],
          pageRefs: [
            {
              key: key,
              name: t('site:frontPage'),
              author: uid(),
              flowTime: Date.now(),
            },
          ],
          key,
        },
        key,
      );

      const siteKey = await createSite(site);

      const frontPage = generateFrontPage(site);

      // Save the front page to the database
      await setDoc(
        doc(
          db,
          SITES_COLLECTION_NAME,
          siteKey,
          PAGES_COLLECTION_NAME,
          frontPage.key,
        ),
        toFirestoreEntry(frontPage),
      );

      // Redirect to the new site
      window.location.href = `/sites/${siteKey}`;
    } catch (e) {
      logError(e);
    }
  }

  return (
    <div class="content-columns">
      <WithLogin>
        <article class="column-l">
          <h1>{t('site:create.title')}</h1>
          <form onsubmit={handleSubmit}>
            <fieldset>
              <label>
                {t('entries:site.name')}
                <input
                  type="text"
                  name="name"
                  required
                  oninput={(e: Event) =>
                    setSiteName((e.target as HTMLInputElement).value)
                  }
                />
              </label>
              <p>
                <code class="p-1">{`pelilauta.web.app/sites/${usePlainTextURL() ? proposedKey() : '[auto]'}`}</code>
              </p>
              {usePlainTextURL() && keyTaken() && (
                <p class="error text-caption" style="padding: var(--cn-grid)">
                  {t('site:create.nameTaken')}
                </p>
              )}

              <GameSystemSelect value={system()} onChange={setSystem} />

              <label>
                {t('entries:site.description')}
                <textarea
                  name="description"
                  placeholder={t('app:meta.optional')}
                />
              </label>

              <cn-toggle-button
                label={t('entries:site.hidden')}
                pressed={false}
                onChange={(e: Event) =>
                  setHidden((e.target as CyanToggleButton).pressed)
                }
              />

              <cn-toggle-button
                label={t('entries:site.customPageKeys')}
                pressed={usePlainTextURL()}
                onChange={(e: Event) =>
                  setUsePlainTextURL((e.target as CyanToggleButton).pressed)
                }
              />
            </fieldset>
            <div class="toolbar justify-end">
              <a href="/library" class="button text">
                {t('actions:cancel')}
              </a>
              <button type="submit" class="call-to-action">
                {t('actions:create.site')}
              </button>
            </div>
          </form>
        </article>
      </WithLogin>
    </div>
  );
};
