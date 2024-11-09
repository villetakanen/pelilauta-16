import { addAssetToSite } from '@firebase/client/site/addAssetToSite';
import type { Site } from '@schemas/SiteSchema';
import { updateSite } from '@stores/SitesApp';
import { t } from '@utils/i18n';
import { type Component, createMemo, createSignal } from 'solid-js';

export const ThemeImageForm: Component<{
  imageFieldName: string;
  site: Site;
}> = (props) => {
  const [preview, setPreview] = createSignal<string | null>(null);

  const siteURL = createMemo(() => {
    const url = (props.site as Record<string, unknown>)[props.imageFieldName];
    if (url) return url as string;
    return '';
  });

  const iconURL = createMemo(() => {
    if (preview()) return preview() as string;
    if (siteURL()) return siteURL() as string;
    return 'https://placehold.co/64x64';
  });

  const fileUploadRef = (
    <input type="file" accept="image/*" onChange={updatePreview} />
  );

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!fileUploadRef) return;
    const file = (fileUploadRef as HTMLInputElement).files?.[0];
    if (!file) return;

    const downloadURL = await addAssetToSite(props.site, file);

    updateSite(
      {
        [props.imageFieldName]: downloadURL,
      },
      props.site.key,
    );
  }

  function updatePreview() {
    if (!fileUploadRef) return;
    const file = (fileUploadRef as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function resetPreview() {
    setPreview(null);
  }

  function deleteImage() {
    updateSite(
      {
        [props.imageFieldName]: '',
      },
      props.site.key,
    );
  }

  return (
    <form onsubmit={handleSubmit}>
      <fieldset class="flex flex-row p-2">
        <div>
          <img
            src={iconURL()}
            alt={t('app:meta.preview')}
            class="preview-icon"
          />
        </div>
        <div>
          <div>
            {t(`entries:site.${props.imageFieldName}`)}
            {fileUploadRef}
          </div>
          <div class="toolbar flex flex-row justify-end">
            <button type="submit" disabled={!preview()}>
              {t('actions:upload')}
            </button>
            <button type="reset" disabled={!preview()} onclick={resetPreview}>
              {t('actions:reset')}
            </button>
            <button type="button" disabled={!siteURL} onclick={deleteImage}>
              {t('actions:delete')}
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  );
};
