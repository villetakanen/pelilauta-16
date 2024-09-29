import { WithLoader } from '@client/shared/WithLoader';
import { PageApp } from '@client/sites/PageApp/PageApp';
import { useStore } from '@nanostores/solid';
import { $active, $site, load } from '@stores/SitesApp';
import { type Component, createMemo, onMount } from 'solid-js';

export const SitesApp: Component<{ siteKey: string }> = (props) => {
  const site = useStore($site);
  const active = useStore($active);

  const pageKey = createMemo(() => site().homepage || site().key);

  onMount(() => {
    load(props.siteKey);
  });

  return (
    <div>
      <WithLoader loading={!active()}>
        <p>{pageKey()}</p>
        <PageApp pageKey={pageKey()} siteKey={site().key} />
      </WithLoader>
    </div>
  );
};
