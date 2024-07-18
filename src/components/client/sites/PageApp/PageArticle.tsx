import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { PageArticleFooter } from './PageArticleFooter';
import { PageArticleHeader } from './PageArticleHeader';

export const PageArticle: Component<{ page: Page; site: Site }> = (props) => {
  const page = createMemo(() => props.page);
  const site = createMemo(() => props.site);
  const markdownContent = createMemo(() => props.page?.markdownContent || '');

  return (
    <article class="column-l elevation-1">
      <PageArticleHeader site={site()} page={page()} />
      <h1 class="downscaled small">{page().name}</h1>
      {markdownContent() ? (
        <MarkdownSection content={markdownContent()} />
      ) : (
        <>
          <div class="elevation-2 debug toolbar">
            <p>{t('sites:page.legacyContent.warning')}</p>
            <button class="text" type="button">
              {t('actions:migrate.toMarkdown')}
            </button>
          </div>
          <div innerHTML={page().htmlContent} />
        </>
      )}
      <PageArticleFooter site={site()} page={page()} />
    </article>
  );
};
