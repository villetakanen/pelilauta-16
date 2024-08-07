import { useStore } from '@nanostores/solid';
import type { Component } from 'solid-js';
import {
  $account,
  $active,
  $isAnonymous,
  $requiresEula,
  $subscriber,
} from 'src/stores/sessionStore';

export const DebugSection: Component = () => {
  const active = useStore($active);
  const eulaAccepted = useStore($requiresEula);
  const account = useStore($account);
  const anonymous = useStore($isAnonymous);

  const subsciption = useStore($subscriber);

  return (
    <div class="debug">
      <section>{account().uid}</section>
      <section class="field-grid">
        <div>Session:</div>
        <div>{active() ? 'active' : 'loading'}</div>

        <div>isAnonymous:</div>
        <div>{`${anonymous()}`}</div>
        <div>requiresEula:</div>
        <div>{`${eulaAccepted()}`}</div>
        <div>showAdminTools:</div>
        <div>{`${account().showAdminTools}`}</div>
      </section>
      <hr />
      <section>
        <pre>{JSON.stringify(subsciption(), null, 2)}</pre>
      </section>
    </div>
  );
};
