import type { Component, JSX } from 'solid-js';

type WithLoginProps<P = Record<string, unknown>> = P & {
  allow: boolean;
  children?: JSX.Element;
};

export const WithAuth: Component<WithLoginProps> = (props) => {
  return props.allow ? props.children : <cn-loader />;
};
