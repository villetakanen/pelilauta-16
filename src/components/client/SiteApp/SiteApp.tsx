import { WithLoader } from '@client/shared/WithLoader';
import { PageApp } from '@client/sites/PageApp/PageApp';
import { useStore } from '@nanostores/solid';
import { type Component, createMemo, onMount } from 'solid-js';
import { $active, $site, load } from '@stores/SitesApp';

export const SiteApp: Component<{ siteKey: string }> = (props) => {
  const site = useStore($site);
  const active = useStore($active);

  const pageKey = createMemo(() => site().homepage || site().key);

  onMount(() => {
    load(props.siteKey);
  });

  return (
    <div>
      <WithLoader loading={!active()}>
        <PageApp pageKey={pageKey()} siteKey={site().key} />
      </WithLoader>
    </div>
  );
};
