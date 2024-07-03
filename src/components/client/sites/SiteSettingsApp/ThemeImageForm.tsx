import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { logError } from '@utils/logHelpers';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { type Component, createMemo, createSignal } from 'solid-js';
import { storage } from 'src/firebase/client';
import { $site, updateSite } from 'src/stores/activeSiteStore';

export const ThemeImageForm: Component<{ imageFieldName: string }> = (
  props,
) => {
  const site = useStore($site);

  const [preview, setPreview] = createSignal<string | null>(null);

  const siteURL = createMemo(() => {
    const url = (site() as Record<string, unknown>)[props.imageFieldName];
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

    // Check the file size
    if (file.size > 1024 * 1024) {
      throw new Error('File size too large');
    }

    const dataurl = preview();
    if (!dataurl || !dataurl.startsWith('data:image')) {
      logError('Invalid file type', dataurl);
      return;
    }

    // Try to upload the file to the storage
    try {
      // Get the file extension
      const ext = file.name.split('.').pop();

      // Create a reference to the file
      const storageRef = ref(
        storage,
        `sites/${site().key}/${props.imageFieldName}.${ext}`,
      );

      await uploadString(storageRef, dataurl, 'data_url');

      const downloadURL = await getDownloadURL(storageRef);
      updateSite({
        [props.imageFieldName]: downloadURL,
      });
    } catch (error) {
      logError(error);
    }
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
    updateSite({
      [props.imageFieldName]: '',
    });
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
          <label>
            {t(`entries:site.${props.imageFieldName}`)}
            {fileUploadRef}
          </label>
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
