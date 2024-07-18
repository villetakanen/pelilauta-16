import { useStore } from '@nanostores/solid';
import { logDebug } from '@utils/logHelpers';
import { type Component, type JSX, createEffect } from 'solid-js';
import { $active, $isAnonymous } from 'src/stores/sessionStore';

type WithLoginProps<P = Record<string, unknown>> = P & {
  children?: JSX.Element;
};

export const WithLogin: Component<WithLoginProps> = (props) => {
  const active = useStore($active);
  const anonymous = useStore($isAnonymous);

  createEffect(() => {
    logDebug('WithLogin effect', { loading: active(), anon: anonymous() });
    if (active()) {
      if (anonymous()) {
        // Anonymous user with an active session, redirect to login
        window.location.href = `/login/?from=${window.location.pathname}`;
      }
    }
  });

  return active() ? props.children : <cn-loader />;
};
