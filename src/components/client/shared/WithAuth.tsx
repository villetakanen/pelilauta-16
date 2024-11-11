import { t } from '@utils/i18n';
import type { Component, JSX } from 'solid-js';

type WithLoginProps<P = Record<string, unknown>> = P & {
  allow: boolean;
  children?: JSX.Element;
  message?: string;
};

export const WithAuth: Component<WithLoginProps> = (props) => {
  return props.allow ? (
    props.children
  ) : (
    <div class="content-columns">
      <article>
        <h1>{t('app:forbidden.title')}</h1>
        <p>{props.message || t('app:forbidden.message')}</p>
        <div class="toolbar">
          <a href="/login" class="button">
            {t('actions:login')}
          </a>
        </div>
      </article>
    </div>
  );
};
