import { PageBackgroundPoster } from '@client/PageBackgroundPoster';
import { useStore } from '@nanostores/solid';
import { $site, load } from '@stores/SitesApp';
import { type Component, createEffect } from 'solid-js';
import { SiteCard } from '../../sites/SiteCard';
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
      <SiteMetaDataSection />
      <ThemingSection />
      <DangerZoneSection />
    </div>
  );
};
