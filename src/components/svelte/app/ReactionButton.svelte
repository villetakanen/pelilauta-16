<script lang="ts">
import { authedPost } from '@firebase/client/apiClient';
import { persistentAtom } from '@nanostores/persistent';
import type { NotificationRequest } from '@schemas/NotificationSchema';
import {
  REACTIONS_COLLECTION_NAME,
  type Reactions,
  reactionsSchema,
} from '@schemas/ReactionsSchema';
import { uid } from '@stores/session';
import { logDebug, logWarn } from '@utils/logHelpers';
import { onMount } from 'svelte';

/**
 * An universal "love" button for Pelilauta 16+. The functionality here might break 16 and lesser
 * versions of the pelilauta social functionality.
 *
 * We'll introduce the button in a non breaking way, but might need to up the MAJOR version
 * if a breaking change is needed.
 *
 * Core concepts:
 * - Each *Entry* has a *Reactions* object in the DB that contains the reactions to that entry.
 * - Each *Reaction* has a *type*, *count* and *users* array. The Count is not stored in the DB, but calculated on the fly.
 * - The *users* array contains the pseudoanonymous user ids of the users that have reacted with the reaction.
 * - subscriptions are used to keep track of the users interested in the entry. F.ex. the owner(s) of the entry.
 *
 * F.ex. a *love* reaction by "user3" to an entry might look like this in the DB:
 * ENTRY_KEY:
 * - subscribers: ['user1', 'user4]
 * - type: 'love'
 * -- users: ['user1', 'user2', 'user3']
 * - type: 'bookmark'
 * -- users: ['user1', 'user2']
 *
 * DB key of the reactions entry is same as the entry key.
 *
 * To query, if a user has reacted with a reaction, you can check if the user id is in the *users* array.
 *
 * To query all users reactions, simply query the *Reactions* object of the entry with "array-contains" "user id".
 */
interface Props {
  title?: string;
  type?: 'love';
  small?: boolean;
  key: string;
  target: 'thread' | 'site' | 'reply';
}
const { type = 'love', small = false, key, target, title }: Props = $props();

const reactions = persistentAtom<Reactions>(
  `reactions/${key}`,
  { subscribers: [] },
  {
    encode: JSON.stringify,
    decode: (data) => {
      const object = JSON.parse(data);
      return reactionsSchema.parse(object);
    },
  },
);

const count = $derived.by(() => {
  return $reactions[type]?.length || 0;
});

const checked = $derived.by(() => {
  return $reactions[type]?.includes($uid) || undefined;
});

const inactive = $derived.by(() => {
  if ($reactions.subscribers.includes($uid)) return true;
  return undefined;
});

onMount(async () => {
  try {
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    const reactionsDoc = await getDoc(
      doc(getFirestore(), `${REACTIONS_COLLECTION_NAME}/${key}`),
    );
    if (reactionsDoc.exists()) {
      reactions.set(reactionsSchema.parse(reactionsDoc.data()));
    }
  } catch (error) {
    logWarn('ReactionButton', 'Failed to fetch reactions:', error);
  }
});

async function onclick(e: Event) {
  e.preventDefault();
  logDebug('ReactionButton', `Reaction ${type} clicked for ${key}`);
  if (!$uid) return;

  const currentReactions = reactions.get();
  const reaction = [...(currentReactions[type] || [])];
  const index = reaction.indexOf($uid);
  const wasAdded = index === -1;

  // Optimistic update
  if (wasAdded) {
    reaction.push($uid);
  } else {
    reaction.splice(index, 1);
  }

  reactions.set({
    ...currentReactions,
    [type]: reaction,
  });

  try {
    const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(
      doc(getFirestore(), `${REACTIONS_COLLECTION_NAME}/${key}`),
      {
        [type]: reaction,
      },
    );

    // Send notifications only when adding a reaction (not removing)
    if (wasAdded && currentReactions.subscribers.length > 0) {
      await sendReactionNotification(currentReactions.subscribers);
    }
  } catch (error) {
    // Rollback on error
    reactions.set(currentReactions);
    logWarn('ReactionButton', 'Failed to update reaction, rolled back:', error);
  }
}

async function sendReactionNotification(subscribers: string[]) {
  if (!['thread', 'reply', 'site'].includes(target)) {
    logWarn('ReactionButton', 'Invalid target for notification:', target);
    return;
  }

  const notification: NotificationRequest = {
    notification: {
      key: '',
      targetType: `${target}.loved`,
      targetKey: key,
      targetTitle: title || key,
    },
    recipients: subscribers,
    from: $uid,
  };

  try {
    await authedPost('/api/notifications/send', {
      body: notification,
    });
  } catch (error) {
    // Log but don't throw - notifications are non-critical
    logWarn('ReactionButton', 'Failed to send notification:', error);
  }
}
</script>

{#if $uid }
  <cn-reaction-button
    {onclick}
    role="button"
    tabindex="0"
    onkeydown={(e: Event) => {if ((e as KeyboardEvent).key === 'Enter') onclick(e);}}
    {count}
    {checked}
    {inactive}
    aria-pressed={checked}
    noun={type}
    small={small || undefined}
  ></cn-reaction-button>  
{/if}


