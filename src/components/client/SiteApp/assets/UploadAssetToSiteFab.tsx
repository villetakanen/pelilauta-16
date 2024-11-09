import { addAssetToSite } from '@firebase/client/site/addAssetToSite';
import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { resizeImage } from '@utils/client/resizeImage';
import { pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import FileUploadButton from './FileUploadButton';

interface UploadAssetToSiteFabProps {
  site: Site;
}

export const UploadAssetToSiteFab: Component<UploadAssetToSiteFabProps> = (
  props,
) => {
  const uid = useStore($uid);
  const visible = () => props.site.owners.includes(uid());

  async function filesUploaded(files: FileList) {
    if (!props.site) {
      throw new Error('No site provided, aborting');
    }

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const resizedFile = await resizeImage(file);
        // Check the file size, reject if it's too big (e.g., 10MB)
        if (resizedFile.size > 10 * 1024 * 1024) {
          throw new Error('File is too big');
        }
        // Upload the resized file
        await addAssetToSite(props.site, resizedFile);
        pushSnack(t('site:assets.upload.success', { file: file.name }));
      } else if (
        file.type === 'application/pdf' ||
        file.type === 'text/plain' ||
        file.type === 'text/markdown'
      ) {
        // Handle PDF, text, and markdown files
        console.log('PDF/Text/Markdown file:', file);

        // Check the file size, reject if it's too big (e.g., 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('File is too big');
        }

        // Upload the file
        await addAssetToSite(props.site, file);
        pushSnack(t('site:assets.upload.success', { file: file.name }));
      } else {
        pushSnack(
          t('site:assets.upload.error.invalidFileType', { file: file.type }),
        );
      }
    }
  }

  return visible() ? (
    <FileUploadButton filesUploaded={filesUploaded} class="fab" />
  ) : null;
};
