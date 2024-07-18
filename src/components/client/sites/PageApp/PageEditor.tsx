import { useStore } from '@nanostores/solid';
import type { Page } from '@schemas/PageSchema';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import { $pages, updatePage } from 'src/stores/activeSiteStore/pagesStore';

export type PageEditorProps = {
  siteKey: string;
  pageKey: string;
};

export const PageEditor: Component<PageEditorProps> = (props) => {
  const pages = useStore($pages);
  const originalPage = createMemo(() =>
    pages().find((page) => page.key === props.pageKey),
  );
  const originalContent = createMemo(() => originalPage()?.markdownContent);

  const handleSubmit = (event: Event) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const updates: Partial<Page> = {};

    const name = formData.get('name') as string;
    if (name !== originalPage()?.name) updates.name = name;

    const content = formData.get('content') as string;
    if (content !== originalContent()) updates.markdownContent = content;

    if (Object.keys(updates).length) {
      updatePage(props.siteKey, props.pageKey, updates);
    }
  };

  return (
    <form class="content-editor" onSubmit={handleSubmit}>
      <section class="toolbar">
        <label class="flex-grow">
          {t('entries:page.name')}
          <input type="text" value={originalPage()?.name} name="name" />
        </label>
        <button disabled type="button" class="fab secondary">
          <cn-icon noun="assets" />
        </button>
      </section>
      <textarea class="content">{originalContent()}</textarea>
      <section class="toolbar justify-end">
        <a
          href={`/sites/${props.siteKey}/${props.pageKey}`}
          class="button text"
        >
          <span>{t('actions:cancel')}</span>
        </a>
        <button type="submit" class="cta" disabled>
          <cn-icon noun="send" />
          <span>{t('actions:save')}</span>
        </button>
      </section>
    </form>
  );
};
