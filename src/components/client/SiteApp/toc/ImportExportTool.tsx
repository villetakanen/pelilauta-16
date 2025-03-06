/**
 * A solid-js component for importing and exporting the wiki markdown content.
 *
 * The markdown headmatter is used to store the metadata of the wiki pages.
 */
import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/session';
import { t } from '@utils/i18n';

interface ImportExportToolProps {
  site: Site;
}

export const ImportExportTool = (props: ImportExportToolProps) => {
  const { site } = props;
  const uid = useStore($uid);

  const visible = () => site.owners.includes(uid());

  return visible() ? (
    <>
      <section class="surface p-2 mt-2">
        <h4>{t('site:toc.import.title')}</h4>
        <p class="downscaled">{t('site:toc.import.description')}</p>
        <a href={`/sites/${site.key}/import-folder`} class="text button">
          <cn-icon noun="arrow-up" />
          <span>{t('site:toc.import.fromFolder')}</span>
        </a>
      </section>
    </>
  ) : null;
};
