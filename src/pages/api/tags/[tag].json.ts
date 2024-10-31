import { serverDB } from '@firebase/server';
import { THREADS_COLLECTION_NAME } from '@schemas/ThreadSchema';
import { toDate } from '@utils/schemaHelpers';
import type { APIContext } from 'astro';

type Thread = {
  title: string;
  key: string;
  tags: string[];
  flowTime: number;
  author: string;
};

type TagData = {
  tag: string;
  threads: Thread[];
};

/**
 * Fetches 20 first of the threads from the firestore, that have the given tag
 *
 * @param tag [string] The tag to search for
 * @returns [Thread[]] An array of threads that have the given tag
 */
async function fetchThreads(tag: string) {
  const docs = serverDB
    .collection(THREADS_COLLECTION_NAME)
    .where('tags', 'array-contains', tag)
    .orderBy('flowTime', 'desc')
    .limit(20);
  const threads = await docs.get();

  const threadData: Thread[] = [];

  for (const thread of threads.docs) {
    const data = thread.data();
    threadData.push({
      title: data.title as string,
      key: thread.id as string,
      tags: data.tags || [],
      flowTime: toDate(data.flowTime).getTime(),
      author: data.owners?.[0] as string,
    });
  }

  return threadData;
}

export async function GET({ params }: APIContext): Promise<Response> {
  const { tag } = params;

  const response: TagData = {
    tag: tag as string,
    threads: [],
  };

  // First we need to fetch all the threads that have the tag
  response.threads = await fetchThreads(tag as string);

  // The same should be done for the other entries with tags, but
  // for now, we will just return the threads with the tag

  if (response.threads.length === 0) {
    return new Response('No threads found', { status: 404 });
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=10, stale-while-revalidate',
    },
  });
}
