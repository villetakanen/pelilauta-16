import {
  THREADS_COLLECTION_NAME,
  type Thread,
  parseThread,
} from '@schemas/ThreadSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { getAstroQueryParams } from '@utils/server/astroApiHelpers';
import type { APIContext } from 'astro';
import { Timestamp } from 'firebase-admin/firestore';
import { serverDB } from 'src/firebase/server';

export async function GET({ request }: APIContext) {
  const publicThreads = new Array<Thread>();

  const { startAt, channel, limit } = getAstroQueryParams(request);

  // Base query for all public threads
  const allPublicThreadsCollection = serverDB
    .collection(THREADS_COLLECTION_NAME)
    .where('public', '==', true)
    .orderBy('flowTime', 'desc');

  // If channel is provided, filter threads by channel
  const channelThreads = channel
    ? allPublicThreadsCollection.where('channel', '==', channel)
    : allPublicThreadsCollection;

  // Start time is a flowTime value, it needs to be converted into a firestore timestamp
  const startTimeTimestamp = startAt
    ? new Timestamp(Number(startAt) / 1000, 0)
    : null;

  // If startTime is provided, filter threads by startTime (pagination by flowTime to circumvent the firestore limitations)
  const currentPageStart = startAt
    ? channelThreads.where('flowTime', '<', startTimeTimestamp)
    : channelThreads;

  // We allow limit up to 11 threads
  const limitValue = limit ? Math.min(Number(limit), 11) : 11;

  // Get the threads
  const threads = await currentPageStart.limit(limitValue).get();

  // Convert the threads to client format
  for (const threadDoc of threads.docs) {
    publicThreads.push(
      parseThread(toClientEntry(threadDoc.data()), threadDoc.id),
    );
  }

  return new Response(JSON.stringify(publicThreads), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=1, stale-while-revalidate',
    },
  });
}
