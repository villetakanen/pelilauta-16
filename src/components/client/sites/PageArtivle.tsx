import { useStore } from '@nanostores/solid';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { WikiPageHeader } from 'src/components/shared/WikiPageHeader';

import { $site } from 'src/stores/activeSiteStore';
import { $pages } from 'src/stores/activeSiteStore/pagesStore';

export const PageArticle: Component<{ page: string }> = (props) => {
  const site = useStore($site);
  const pages = useStore($pages);
  const page = createMemo(() => {
    return pages().find((p) => p.key === props.page);
  });

  return (
    <div>
      <WikiPageHeader page={page()} site={site()} />
      <h1>{page()?.name}</h1>
      {page()?.markdownContent ? (
        <MarkdownSection content={`${page()?.markdownContent}`} />
      ) : (
        <div innerHTML={page()?.htmlContent} />
      )}
    </div>
  );
};
