/**
 * A Solid-js button, that when clicked, counts the number of threads in the given channel slug,
 * and send those as an update to the parent component.
 */

import { db } from '@firebase/client';
import { THREADS_COLLECTION_NAME } from '@schemas/ThreadSchema';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Component } from 'solid-js';

interface RepairThreadCountButtonProps {
  slug: string;
  onRepairRequest: (count: number) => void;
}

export const RepairThreadCountButton: Component<
  RepairThreadCountButtonProps
> = (props) => {
  const handleClick = async () => {
    // Count the number of threads in the channel
    const channelThreadsQuery = query(
      collection(db, THREADS_COLLECTION_NAME),
      where('channel', '==', props.slug),
    );
    const docs = await getDocs(channelThreadsQuery);
    const count = docs.size;

    // Post the count to the parent
    props.onRepairRequest(count);
  };

  return (
    <button type="button" onClick={handleClick} class="btn btn-primary">
      <cn-icon noun="spiral" />
      <span>REPAIR</span>
    </button>
  );
};
