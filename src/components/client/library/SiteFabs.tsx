import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $isAnonymous } from 'src/stores/sessionStore';

export const SiteFabs: Component = () => {
  const anon = useStore($isAnonymous);

  return (
    <>
      {!anon() && (
        <a class="fab" href="/create/site">
          <cn-icon noun="add" small />
          <span class="sm-hidden">{t('actions:create.site')}</span>
        </a>
      )}
    </>
  );
};
