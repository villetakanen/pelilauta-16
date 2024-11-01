import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { updatePage } from '@stores/SitesApp/pagesStore';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, createSignal, onMount } from 'solid-js';
import { PageCategorySelect } from './PageCategorySelect';

export type PageEditorProps = {
  site: Site;
  page: Page;
};

export const PageEditor: Component<PageEditorProps> = (props) => {
  const [changed, setChanged] = createSignal(false);
  const [content, setContent] = createSignal(props.page.markdownContent || '');
  const originalPage = props.page;
  const originalContent = props.page.markdownContent || '';
  const [category, setCategory] = createSignal(props.page.category || '');
  let editorRef: undefined | HTMLElement;

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const updates: Partial<Page> = {};

    const name = formData.get('name') as string;
    if (name !== originalPage?.name) updates.name = name;

    const c = content();
    if (c !== originalContent) updates.markdownContent = c;

    const cat = category();
    if (cat !== originalPage?.category) updates.category = cat;

    if (Object.keys(updates).length) {
      await updatePage(props.site.key, props.page.key, updates);
    }

    window.location.href = `/sites/${props.site.key}/${props.page.key}`;
  };

  onMount(() => {
    const r = document.querySelector('cn-editor');
    if (r instanceof HTMLElement) {
      editorRef = r;
      editorRef.addEventListener('input', handleEditorInput);
    }
  });

  function handleEditorInput(e: Event) {
    setChanged(true);
    const content = (e as CustomEvent<{ value: string }>).detail.value;
    logDebug('Editor input', content);
    setContent(content);
  }

  function categoryChaged(cat: string) {
    setCategory(cat);
    setChanged(true);
  }

  return (
    <form class="content-editor" onSubmit={handleSubmit}>
      <section class="toolbar">
        <label class="grow">
          {t('entries:page.name')}
          <input
            type="text"
            value={originalPage?.name}
            name="name"
            onInput={() => setChanged(true)}
          />
        </label>

        <PageCategorySelect
          site={props.site}
          pageCategory={category()}
          setPageCategory={categoryChaged}
        />

        <button disabled type="button" class="fab secondary">
          <cn-icon noun="assets" />
        </button>
      </section>
      <div class="grow">
        <cn-editor ref={editorRef} value={originalContent} />
      </div>
      <section class="toolbar justify-end">
        <a
          href={`/sites/${props.site.key}/${props.page.key}`}
          class="button text"
        >
          <span>{t('actions:cancel')}</span>
        </a>
        <button type="submit" class="cta" disabled={!changed()}>
          <cn-icon noun="send" />
          <span>{t('actions:save')}</span>
        </button>
      </section>
    </form>
  );
};
