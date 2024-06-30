import { persistentAtom } from '@nanostores/persistent';
import {
  ASSETS_COLLECTION_NAME,
  type Asset,
  ParseAsset,
} from '@schemas/AssetSchema';
import { logDebug } from '@utils/logHelpers';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from 'src/firebase/client';

// *** Store loading state *************************************************
type LoadingStateValue = 'initial' | 'loading' | 'active';
const $loadingState = persistentAtom<LoadingStateValue>(
  'assets-store',
  'initial',
);

export const $assets = persistentAtom<Asset[]>(
  `${ASSETS_COLLECTION_NAME}`,
  [],
  {
    encode: JSON.stringify,
    decode: (data) => {
      return JSON.parse(data)?.map((entry: Record<string, unknown>) => {
        return ParseAsset(entry, entry.key as string);
      });
    },
  },
);

export async function loadUserAssets(uid: string) {
  logDebug('loadUserAssets', 'loading assets');
  $loadingState.set('loading');
  // Load user media

  const q = query(
    collection(db, ASSETS_COLLECTION_NAME),
    where('owner', '==', uid),
  );

  const docs = await getDocs(q);

  for (const doc of docs.docs) {
    mergeAssetToStore(ParseAsset(doc.data(), doc.id));
  }

  logDebug('loadUserAssets', 'assets loaded');
  $loadingState.set('active');
}

/**
 * Merge asset to the store, assets are stored in the store in an array,
 * and we need to check that we do not have duplicates.
 *
 * @param asset
 */
function mergeAssetToStore(asset: Asset) {
  const currentAssets = $assets.get();

  const index = currentAssets.findIndex((a) => a.key === asset.key);
  if (index === -1) {
    currentAssets.push(asset);
  } else {
    currentAssets[index] = asset;
  }

  $assets.set(currentAssets);
}
