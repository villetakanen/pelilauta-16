import { PageBackgroundPoster } from '@client/PageBackgroundPoster';
import { WithAuth } from '@client/shared/WithAuth';
import { WithLoader } from '@client/shared/WithLoader';
import { db } from '@firebase/client';
import { useStore } from '@nanostores/solid';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { toClientEntry } from '@utils/client/entryUtils';
import { doc, onSnapshot } from 'firebase/firestore';
import { type Component, createSignal, onMount } from 'solid-js';
import { SiteCard } from '../../sites/SiteCard';
import { DangerZoneSection } from './DangerZoneSection';
import { SiteMetaDataSection } from './SiteMetaDataSection';
import { ThemingSection } from './ThemingSection';

export const SiteSettingsApp: Component<{ site: string }> = (props) => {
  const uid = useStore($uid);
  const [site, setSite] = createSignal<Site | undefined>(undefined);
  const allow = () => !!site()?.owners.includes(uid());

  onMount(async () => {
    // Load the site data from Firestore
    const siteRef = doc(db, SITES_COLLECTION_NAME, props.site);
    onSnapshot(siteRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const newSite = parseSite(toClientEntry(data), props.site);
        setSite(newSite);
      }
    });
  });

  return (
    <WithLoader loading={!site()}>
      <WithAuth allow={allow()}>
        <div class="content-columns">
          {!!site()?.backgroundURL && (
            <PageBackgroundPoster url={`${site()?.backgroundURL}`} />
          )}
          <SiteCard {...(site() as Site)} />
          <SiteMetaDataSection site={site() as Site} />
          <ThemingSection site={site() as Site} />
          <DangerZoneSection site={site() as Site} />
        </div>
      </WithAuth>
    </WithLoader>
  );
};
