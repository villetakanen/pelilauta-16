import { persistentAtom } from '@nanostores/persistent';
import {
  MetaTopicsSchema,
  type Topic,
  topicSchema,
} from '@schemas/MetaTopicsSchema';
import { logError, logWarn } from '@utils/logHelpers';
import { toDate } from '@utils/schemaHelpers';
import { doc, getDoc } from 'firebase/firestore';
import { onMount } from 'nanostores';
import { db } from 'src/firebase/client';
import { ZodError } from 'zod';

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

// $channels is an alias for $topics
export const $channels = $topics;

onMount($topics, () => {
  fetchTopicsFromDB();
});

async function fetchTopicsFromDB() {
  const topicsDoc = doc(db, 'meta', 'threads');

  const docSnap = await getDoc(topicsDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data) {
      try {
        const topics = MetaTopicsSchema.parse(
          data.topics.map((entry: Partial<Topic>) => ({
            ...entry,
            flowTime: toDate(entry.flowTime).getTime(),
          })),
        );
        // logDebug('fetchTopicsFromDB', 'Fetched topics from db', topics);
        // force category 'pelilauta' if empty
        for (const topic of topics) {
          if (!topic.category) {
            topic.category = 'Pelilauta';
          }
        }
        $topics.set(topics);
      } catch (err) {
        if (err instanceof ZodError) {
          logError('fetchTopicsFromDB', 'ZodError', err.errors);
        }
      }
    } else {
      logWarn('fetchTopicsFromDB', 'No topics found in db');
      $topics.set([]);
    }
  }
}

export function topicToNoun(topic?: string) {
  if (!topic) {
    return 'close';
  }
  const topics = $topics.get();
  // logDebug('topicToNoun', 'topics', topics, 'topic', topic);
  const topicObj = topics.find((t) => t.slug === topic);
  return topicObj?.icon || 'fox';
}
