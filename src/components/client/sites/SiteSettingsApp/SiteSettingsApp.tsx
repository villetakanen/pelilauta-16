import { PageBackgroundPoster } from '@client/PageBackgroundPoster';
import { useStore } from '@nanostores/solid';
import { type Component, createEffect } from 'solid-js';
import { $site, load } from 'src/stores/activeSiteStore';
import { SiteCard } from '../SiteCard';
import { DangerZoneSection } from './DangerZoneSection';
import { SiteMetaDataSection } from './SiteMetaDataSection';
import { ThemingSection } from './ThemingSection';

export const SiteSettingsApp: Component<{ site: string }> = (props) => {
  const site = useStore($site);

  createEffect(() => {
    load(props.site);
  });

  return (
    <div class="content-columns">
      {site().backgroundURL && (
        <PageBackgroundPoster url={`${site().backgroundURL}`} />
      )}
      <SiteCard {...site()} />
      <DangerZoneSection />
      <SiteMetaDataSection />
      <ThemingSection />
      <div class="debug">
        <p>key: {props.site}</p>
        <br />
        <p>{JSON.stringify(site())}</p>
      </div>
    </div>
  );
};
