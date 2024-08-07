import { persistentAtom } from '@nanostores/persistent';
import {
  MetaTopicsSchema,
  type Topic,
  topicSchema,
} from '@schemas/MetaTopicsSchema';
import { logWarn } from '@utils/logHelpers';
import { doc, getDoc } from 'firebase/firestore';
import { onMount } from 'nanostores';
import { db } from 'src/firebase/client';

export const $topics = persistentAtom<Topic[]>('thread-topics', [], {
  encode: JSON.stringify,
  decode: (data) => {
    return JSON.parse(data).map((entry: Partial<Topic>) => {
      return topicSchema.parse({
        name: entry.name || '',
        description: entry.description || '',
        icon: entry.icon || 'pelilauta',
        slug: entry.slug || 'anon',
        category: entry.category || 'Pelilauta',
        threadCount: entry.threadCount || 0,
        flowTime: entry.flowTime || new Date().getTime(),
      });
    });
  },
});

onMount($topics, () => {
  fetchTopicsFromDB();
});

async function fetchTopicsFromDB() {
  const topicsDoc = doc(db, 'meta', 'threads');

  const docSnap = await getDoc(topicsDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data) {
      const topics = MetaTopicsSchema.parse(data.topics);
      // logDebug('fetchTopicsFromDB', 'Fetched topics from db', topics);
      // force category 'pelilauta' if empty
      for (const topic of topics) {
        if (!topic.category) {
          topic.category = 'Pelilauta';
        }
      }
      $topics.set(topics);
    } else {
      logWarn('fetchTopicsFromDB', 'No topics found in db');
      $topics.set([]);
    }
  }
}
