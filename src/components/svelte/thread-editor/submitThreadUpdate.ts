import { THREADS_COLLECTION_NAME, type Thread } from '@schemas/ThreadSchema';

export async function submitThreadUpdate(
  data: FormData,
  uid: string,
  tags: string[],
  files: File[],
) {
  const { addThread } = await import('@firebase/client/threads/addThread');

  const title = data.get('title') as string;
  const markdownContent = data.get('markdownContent') as string;
  const channel = data.get('channel') as string;

  if (!title || !markdownContent || !channel) {
    throw new Error('Missing minimum required fields');
  }

  const thread: Partial<Thread> = {
    title,
    markdownContent,
    channel,
    owners: [uid],
    author: uid,
  };

  if (tags.length > 0) {
    thread.tags = tags;
  }

  return await addThread(thread, files, uid);
}
