import { useStore } from '@nanostores/solid';
import { type Component, createEffect, createMemo } from 'solid-js';
import { PosterSection } from 'src/components/shared/PosterSection';
import { $site, load } from 'src/stores/activeSiteStore';

export const SitePoster: Component<{ site: string }> = (props) => {
  const site = useStore($site);
  const sitekey = createMemo(() => props.site);

  createEffect(() => {
    load(sitekey());
  });

  return <PosterSection title={site().name} poster={site().posterURL} />;
};
