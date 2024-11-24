import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { updatePage } from '@stores/SitesApp/pagesStore';
import { t } from '@utils/i18n';
import { type Component, createSignal, onMount } from 'solid-js';
import TurndownService from 'turndown';
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
  const [converted, setConverted] = createSignal(false);
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

    // Check if we are missing markdown content, if so, convert the HTML content to markdown
    // And add a warning to the form
    if (!props.page.markdownContent) {
      const content = props.page.htmlContent
        ? new TurndownService().turndown(props.page.htmlContent)
        : props.page.content;

      if (content) {
        setContent(content);
        setConverted(true);
      }
    }
  });

  const r = document.querySelector('cn-editor');
  if (r instanceof HTMLElement) {
    editorRef = r;
    editorRef.addEventListener('input', handleEditorInput);
  }

  function handleEditorInput(e: Event) {
    setChanged(true);
    const content = (e as CustomEvent<{ value: string }>).detail.value;
    //logDebug('Editor input', content);
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

      {converted() && (
        <div class="alert warning flex flex-row items-center px-1">
          <cn-icon noun="admin" />
          <p>{t('site:page.editor.contentMigrateWarning')}</p>
        </div>
      )}

      <div class="grow">
        <cn-editor ref={editorRef} value={content()} />
      </div>
      <section class="toolbar">
        <a
          href={`/sites/${props.site.key}/${props.page.key}/deleteConfirm`}
          class="button text"
        >
          <cn-icon noun="delete" xsmall />
          <span>{t('actions:delete')}</span>
        </a>

        <div class="grow" />

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
