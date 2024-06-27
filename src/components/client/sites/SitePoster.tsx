import { useStore } from '@nanostores/solid';
import { type Component, createMemo } from 'solid-js';
import { PosterSection } from 'src/components/shared/PosterSection';
import { $sites } from 'src/stores/sitesStore';

export const SitePoster: Component<{ site: string }> = (props) => {
  const sites = useStore($sites);
  const site = createMemo(() => sites().find((s) => s.key === props.site));

  return <PosterSection title={`${site()?.name}`} poster={site()?.posterURL} />;
};
