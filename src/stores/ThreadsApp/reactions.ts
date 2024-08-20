import type { Notification } from '@schemas/NotificationSchema';
import { parseReply } from '@schemas/ReplySchema';
import { addReaction } from '@stores/SocialApp/reactionStore';
import { toClientEntry } from '@utils/client/entryUtils';
import { logDebug } from '@utils/logHelpers';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'src/firebase/client';
import { updateReply } from './discussion';

/**
 * Given   I am logged in
 *   And   Have a profile
 *   And   A reply is not loved by me
 *         (and, thus) The reply exists
 *  When   I click love on a reply
 *  Then   // The reply is loved visually
 *   And   The reply loved count++
 *   And   The reply is added to my reactions collection
 *
 * @param uid Firebase user UID, with a valid profile data in /database/profiles/{uid}
 * @param threadid The id of a Stream Thread, found in /database/stream/{threadid}
 * @param replyid the id of a reply, of the thread, found in /database/stream/{threadid}/comments/{replyid}
 */
export async function loveReply(
  uid: string,
  threadKey: string,
  replyKey: string,
): Promise<void> {
  // Get the reply
  const replyRef = doc(db, 'stream', threadKey, 'comments', replyKey);
  const replyDoc = await getDoc(replyRef);

  if (!replyDoc.exists) {
    throw new Error(
      `state/loveReply, trying to love by a non existing reply ${threadKey}/${replyKey}`,
    );
  }

  const reply = parseReply(
    toClientEntry(replyDoc.data() || {}),
    threadKey,
    replyKey,
  );

  const lovesArray: Array<string> = reply.lovers || [];

  if (lovesArray.includes(uid)) {
    throw new Error('Can not love a reply, one already loves');
  }

  lovesArray.push(uid);

  logDebug('legacy reactions/loveReply, lovesArray', lovesArray);
  updateReply(
    { lovers: lovesArray, lovesCount: lovesArray.length },
    replyKey,
    threadKey,
  );

  // Add reaction to social graph

  const reaction: Notification = {
    key: replyKey,
    from: uid,
    to: reply.owners[0],
    targetType: 'replylove',
    targetKey: `${threadKey}/${replyKey}`,
    createdAt: new Date(),
    read: false,
    message: reply.markdownContent?.substring(0, 120) || '',
  };

  addReaction(reaction);
}

/**
 * Given   I am logged in
 *   And   Have a profile
 *   And   A reply is loved by me
 *         (and, thus) The reply exists
 *  When   I click love on a reply
 *  Then   // The reply is no longer loved visually
 *   And   The reply loved count--
 *   And   The reply is removed from my reactions collection
 *
 * @param uid Firebase user UID, with a valid profile data in /database/profiles/{uid}
 * @param threadid The id of a Stream Thread, found in /database/stream/{threadid}
 * @param replyid the id of a reply, of the thread, found in /database/stream/{threadid}/comments/{replyid}
 */
export async function unloveReply(
  uid: string,
  threadid: string,
  replyid: string,
): Promise<void> {
  const replyRef = doc(db, 'stream', threadid, 'comments', replyid);

  const replyDoc = await getDoc(replyRef);

  if (!replyDoc.exists) {
    throw new Error(
      `state/unloveReply, trying to unlove a non existing reply ${threadid}/${replyid}`,
    );
  }

  const reply = parseReply(
    toClientEntry(replyDoc.data() || {}),
    replyid,
    threadid,
  );

  const lovesArray: Array<string> = reply.lovers || [];

  if (!lovesArray.includes(uid)) {
    throw new Error('Can not unlove a reply, one does not love');
  }

  const index = lovesArray.indexOf(uid);
  lovesArray.splice(index, 1);

  logDebug('legacy reactions/unloveReply, lovesArray', lovesArray);
  updateReply(
    { lovers: lovesArray, lovesCount: lovesArray.length },
    replyid,
    threadid,
  );
}
