import { useStore } from '@nanostores/solid';
import {
  PAGES_COLLECTION_NAME,
  type Page,
  parsePage,
} from '@schemas/PageSchema';
import { SITES_COLLECTION_NAME } from '@schemas/SiteSchema';
import { logDebug } from '@utils/logHelpers';
import { doc, getDoc } from 'firebase/firestore';
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
} from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { db } from 'src/firebase/client';
import { $sites } from 'src/stores/sitesStore';

type PageArticleProps = {
  site: string;
  page?: string;
};

export const PageArticle: Component<PageArticleProps> = (props) => {
  const sites = useStore($sites);
  const site = createMemo(() => sites().find((s) => s.key === props.site));
  const pageKey = createMemo(() =>
    props.page ? props.page : site()?.homepage || props.site,
  );

  const [page, setPage] = createSignal<Page | null>(null);

  createEffect(async () => {
    logDebug(`Fetching page: ${pageKey()}`);
    const s = site();
    if (!s) return;
    const p = pageKey();
    if (!p) return;
    const pageDoc = await getDoc(
      doc(db, SITES_COLLECTION_NAME, s.key, PAGES_COLLECTION_NAME, p),
    );
    logDebug(`Page doc: ${pageDoc.data()?.name}`);
    if (pageDoc.exists()) {
      setPage(parsePage(pageDoc.data(), pageDoc.id, s.key));
    }
  });

  return (
    <div>
      <h1>{page()?.name}</h1>
      {page()?.markdownContent ? (
        <MarkdownSection content={`${page()?.markdownContent}`} />
      ) : (
        <div innerHTML={page()?.htmlContent} />
      )}
    </div>
  );
};
