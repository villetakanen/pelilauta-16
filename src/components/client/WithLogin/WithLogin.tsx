import { useStore } from '@nanostores/solid';
import { logDebug } from '@utils/logHelpers';
import { type Component, type JSX, createEffect } from 'solid-js';
import { $loadingState, isAnonymous } from 'src/stores/sessionStore';

type WithLoginProps<P = Record<string, unknown>> = P & {
  children?: JSX.Element;
};

export const WithLogin: Component<WithLoginProps> = (props) => {
  const loading = useStore($loadingState);
  const anon = useStore(isAnonymous);

  createEffect(() => {
    logDebug('WithLogin effect', { loading: loading(), anon: anon() });
    if (anon()) {
      window.location.href = `/login/?from=${window.location.pathname}`;
    }
  });

  return (
    <>
      {loading() !== 'loaded' && <cn-loader />}
      {loading() === 'loaded' && props.children}
    </>
  );
};
