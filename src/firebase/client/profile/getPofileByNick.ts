import  { type PublicProfile, PublicProfileSchema } from "@stores/profilesStore";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "..";
import { PROFILES_COLLECTION_NAME } from "@schemas/ProfileSchema";

export async function getProfileByNick(nick: string): Promise<PublicProfile | undefined> {
  const nickQuery = query(
    collection(db, PROFILES_COLLECTION_NAME),
    where('nick', '==', nick),
  );
  const snapshot = await getDocs(nickQuery);
    if (snapshot.docs.length === 0) {
        return;
    }
    const profileDoc = snapshot.docs[0];

    return PublicProfileSchema.parse({
        ...profileDoc.data(),
    });
}