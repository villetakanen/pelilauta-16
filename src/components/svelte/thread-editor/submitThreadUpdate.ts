import { authedPost } from '@firebase/client/apiClient';
import { type Channel, ChannelSchema } from '@schemas/ChannelSchema';
import type { Thread } from '@schemas/ThreadSchema';

export async function syndicateToBsky(
  thread: Thread,
  uid: string,
): Promise<void> {
  const { getProfile } = await import('@stores/profilesStore');

  const profile = getProfile(uid);

  // Fetch channels from the server
  const channelsResponse = await fetch(
    `${window.location.origin}/api/meta/channels.json`,
  );
  const channelsData = await channelsResponse.json();
  const channels = channelsData.map((channel: Partial<Channel>) =>
    ChannelSchema.parse(channel),
  );
  const channelTitle =
    channels.find((channel: Channel) => channel.slug === thread.channel)
      ?.name || thread.channel;

  if (!thread.markdownContent) return;

  const text = `${profile?.nick || 'Pelilauta'} loi uuden ketjun aiheessa: ${channelTitle}\n\n #roolipelit #pelilauta #roolipelsky`;
  const linkUrl = `https://pelilauta.social/threads/${thread.key}`;
  const linkTitle = thread.title;
  const linkDescription = `${thread.markdownContent.substring(0, 220)}...`;

  await authedPost(`${window.location.origin}/api/bsky/skeet`, {
    text,
    linkUrl,
    linkTitle,
    linkDescription,
  });
}

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

  const posted = await addThread(thread, files, uid);

  await syndicateToBsky(posted, uid);

  return posted.key;
}
