import { useStore } from '@nanostores/solid';
import { type Component, createEffect } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { $site, load } from 'src/stores/activeSiteStore';
import { SiteMetaDataSection } from './SiteMetaDataSection';

export const SiteSettingsApp: Component<{ site: string }> = (props) => {
  const site = useStore($site);

  createEffect(() => {
    load(props.site);
  });

  return (
    <div class="content-columns">
      <cn-card title={site().name} class="column-s">
        <MarkdownSection content={`${site().description}`} />
      </cn-card>
      <SiteMetaDataSection />
      <div class="debug">key: {props.site}</div>
    </div>
  );
};
