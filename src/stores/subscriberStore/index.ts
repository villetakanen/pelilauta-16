import { persistentAtom } from '@nanostores/persistent';
import {
  type Subscriber,
  createSubscriber,
  parseSubscriber,
} from '../../schemas/SubscriberSchema';

export const subscriberStore = persistentAtom<Subscriber>(
  'subscriberStore',
  createSubscriber(''),
  {
    encode: JSON.stringify,
    decode: (data) => {
      const object = JSON.parse(data);
      return parseSubscriber(object, object.key);
    },
  },
);
