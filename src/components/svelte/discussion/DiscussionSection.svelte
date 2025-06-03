<script lang="ts">
import {
  REPLIES_COLLECTION,
  type Reply,
  ReplySchema,
} from '@schemas/ReplySchema';
import { THREADS_COLLECTION_NAME, type Thread } from '@schemas/ThreadSchema';
import { markEntrySeen } from '@stores/subscription';
import { toClientEntry } from '@utils/client/entryUtils';
import { fixImageData } from '@utils/fixImageData';
import { onMount } from 'svelte';
import ReplyArticle from './ReplyArticle.svelte';
import ReplyDialog from './ReplyDialog.svelte';

interface Props {
  thread: Thread;
  discussion: Reply[];
}
const { discussion: initDiscussion, thread }: Props = $props();

let discussion = $state(initDiscussion);

onMount(async () => {
  markEntrySeen(thread.key);

  const { getFirestore, query, collection, orderBy, onSnapshot } = await import(
    'firebase/firestore'
  );
  const db = getFirestore();

  const q = query(
    collection(db, THREADS_COLLECTION_NAME, thread.key, REPLIES_COLLECTION),
    orderBy('createdAt', 'asc'),
  );

  onSnapshot(q, (querySnapshot) => {
    const d = [...discussion];
    for (const change of querySnapshot.docChanges()) {
      const data = change.doc.data();
      if (change.type === 'removed') {
        const remove = d.findIndex((r) => r.key === change.doc.id);
        if (remove !== -1) {
          d.splice(remove, 1);
        }
      } else {
        const index = d.findIndex((r) => r.key === change.doc.id);
        const reply = ReplySchema.parse({
          ...toClientEntry(fixImageData(data)),
          key: change.doc.id,
        });
        if (index !== -1) {
          d[index] = reply;
        } else {
          d.push(reply);
        }
      }
    }
    discussion = d;
  });
});
</script>
<div class="content-columns">
  <section class="column-l">
    <div class="flex-col">
    {#each discussion as reply}
      <ReplyArticle {reply} />
    {/each}
    </div>
    <ReplyDialog {thread}/>
  </section>
</div>