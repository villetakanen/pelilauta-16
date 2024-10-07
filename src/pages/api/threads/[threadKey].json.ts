import { serverDB } from '@firebase/server';
import { THREADS_COLLECTION_NAME, parseThread } from '@schemas/ThreadSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import type { APIContext } from 'astro';

export async function GET({ params }: APIContext): Promise<Response> {
  const { threadKey } = params;

  if (!threadKey) {
    return new Response('Invalid request', { status: 400 });
  }

  const threadDoc = await serverDB
    .collection(THREADS_COLLECTION_NAME)
    .doc(threadKey)
    .get();

  const data = threadDoc.data();

  if (!threadDoc.exists || !data) {
    return new Response('Thread not found', { status: 404 });
  }

  try {
    const thread = parseThread(toClientEntry(data), threadKey);
    return new Response(JSON.stringify(thread), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate',
      },
    });
  } catch (err: unknown) {
    return new Response('Invalid thread data', { status: 500 });
  }
}
