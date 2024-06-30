import { useStore } from '@nanostores/solid';
import { type Component, createEffect } from 'solid-js';
import { $site, load } from 'src/stores/activeSiteStore';
import { SiteCard } from '../SiteCard';
import { SiteMetaDataSection } from './SiteMetaDataSection';

export const SiteSettingsApp: Component<{ site: string }> = (props) => {
  const site = useStore($site);

  createEffect(() => {
    load(props.site);
  });

  return (
    <div class="content-columns">
      <SiteCard {...site()} />
      <SiteMetaDataSection />
      <div class="debug">
        <p>key: {props.site}</p>
        <br />
        <p>{JSON.stringify(site())}</p>
      </div>
    </div>
  );
};
