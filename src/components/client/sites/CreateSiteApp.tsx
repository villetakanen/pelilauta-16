import type { CyanToggleButton } from '@11thdeg/cyan-next';
import { WithLogin } from '@client/WithLogin/WithLogin';
import { SITES_COLLECTION_NAME, parseSite } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { logDebug, logError } from '@utils/logHelpers';
import { toMekanismiURI } from '@utils/toMekanismiURI';
import { doc, getDoc } from 'firebase/firestore';
import { type Component, createSignal } from 'solid-js';
import { db } from 'src/firebase/client';

export const CreateSiteApp: Component = () => {
  const [usePlainTextURL, setUsePlainTextURL] = createSignal(true);
  const [nameTaken, setNameTaken] = createSignal(false);
  const [proposedName, setProposedName] = createSignal('');
  const [hidden, setHidden] = createSignal(false);

  async function handleSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    logError(
      'CreateSiteApp.handleSubmit not implemented yet',
      'formData',
      formData,
    );

    if (usePlainTextURL()) {
      // Verify that the name is not taken
      const siteRef = await getDoc(
        doc(db, SITES_COLLECTION_NAME, toMekanismiURI(proposedName())),
      );
      if (siteRef.exists()) {
        setNameTaken(true);
        return;
      }
    }

    const key = usePlainTextURL() ? toMekanismiURI(proposedName()) : '';

    const site = parseSite(
      {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        hidden: hidden(),
        customPageKeys: usePlainTextURL(),
        key,
      },
      key,
    );

    logDebug('CreateSiteApp.handleSubmit', 'site', site);
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
                    setProposedName((e.target as HTMLInputElement).value)
                  }
                />
              </label>

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

              {usePlainTextURL() && (
                <>
                  <label class={`${nameTaken() ? 'error' : ''}`}>
                    {t('entries:site.key')}
                    <input
                      type="text"
                      name="url"
                      placeholder={toMekanismiURI(proposedName())}
                    />
                  </label>
                  {!nameTaken() && (
                    <p class="notify text-caption">
                      {t('site:create.nameTaken')}
                    </p>
                  )}
                </>
              )}
            </fieldset>
            <div class="toolbar justify-end">
              <button type="submit" class="call-to-action">
                {t('actions:create')}
              </button>
            </div>
          </form>
        </article>
      </WithLogin>
    </div>
  );
};
