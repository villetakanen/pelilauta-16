import { WithLoader } from '@client/shared/WithLoader';
import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { PageArticleFooter } from '../PageApp/PageArticleFooter';
import { PageArticleHeader } from '../sites/PageApp/PageArticleHeader';
import { MigrateContentPanel } from './MigrateContentPanel';

export const PageArticle: Component<{ page: Page; site: Site }> = (props) => {
  const page = createMemo(() => props.page);
  const site = createMemo(() => props.site);
  const markdownContent = createMemo(() => props.page?.markdownContent || '');

  return (
    <article class="column-l elevation-1 p-2">
      <WithLoader loading={!page().name}>
        <PageArticleHeader site={site()} page={page()} />
        <h1 class="downscaled small">{page().name}</h1>
        {markdownContent() ? (
          <MarkdownSection content={markdownContent()} />
        ) : (
          <MigrateContentPanel
            siteKey={site().key}
            pageKey={page().key}
            htmlContent={`${page().htmlContent || page().content}`}
          />
        )}
        <PageArticleFooter site={site()} page={page()} />
      </WithLoader>
    </article>
  );
};
