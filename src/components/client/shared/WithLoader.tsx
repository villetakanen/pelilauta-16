/**
 * A solid-js wrapper for a component that will show a loading spinner
 */

import { type Component, type JSX, createMemo } from 'solid-js';

type WithLoginProps<P = Record<string, unknown>> = P & {
  loading: boolean;
  children?: JSX.Element;
};

export const WithLoader: Component<WithLoginProps> = (props) => {
  const loading = createMemo(() => props.loading);
  return (
    <div class="column-l">
      {loading() ? (
        <div class="flex justify-center">
          <cn-loader />
        </div>
      ) : (
        props.children
      )}
    </div>
  );
};
