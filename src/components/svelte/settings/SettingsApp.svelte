<script lang="ts">
import {
  PROFILES_COLLECTION_NAME,
  type Profile,
  parseProfile,
} from '@schemas/ProfileSchema';
import ProfileSection from '@shared/ProfileSection.svelte';
import { uid } from '@stores/session';
import { toClientEntry } from '@utils/client/entryUtils';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { onMount } from 'svelte';
import ProfileTool from './ProfileTool.svelte';

let profile: Profile | null = $state(null);

onMount(() => {
  logDebug('SettingsApp mounted', { uid: $uid });
  if ($uid === null) {
    window.location.href = '/login';
  }
  subscribe();
});

async function subscribe() {
  logDebug('SettingsApp subscribe', { uid: $uid });
  const { onSnapshot, doc, getFirestore } = await import('firebase/firestore');

  onSnapshot(doc(getFirestore(), PROFILES_COLLECTION_NAME, $uid), (doc) => {
    logDebug('SettingsApp onSnapshot', { doc: doc.data() });
    if (!doc.exists()) {
      return;
    }
    const p = parseProfile(toClientEntry(doc.data()), doc.id);
    profile = p;
  });
}
</script>

<div class="content-columns">
  {#if profile}
    <div>
      <h3>{t('settings:preview.title')}</h3>
      <ProfileSection {profile} />
    </div>
    <ProfileTool {profile} />
  {:else}
    <div>
      <cn-loader></cn-loader>
    </div>
  {/if}
</div>
