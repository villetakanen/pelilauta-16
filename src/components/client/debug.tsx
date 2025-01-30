import { useStore } from '@nanostores/solid';
import { $active, $isAnonymous, $subscriber, $uid } from '@stores/session';
import { $account } from '@stores/session/account';
import type { Component } from 'solid-js';

export const DebugSection: Component = () => {
  const active = useStore($active);
  const uid = useStore($uid);
  const anonymous = useStore($isAnonymous);
  const account = useStore($account);

  const subsciption = useStore($subscriber);

  return (
    <div>
      <h3>DEBUG</h3>
      <section class="debug border-radius">
        <h4>Account</h4>
        <p>uid: {uid()}</p>
        <pre>{JSON.stringify(account(), null, 2)}</pre>
      </section>

      <section class="debug border-radius">
        <h4>Subscription</h4>
        <pre>{JSON.stringify(subsciption(), null, 2)}</pre>
      </section>

      <section class="field-grid debug border-radius">
        <div>Session:</div>
        <div>{active() ? 'active' : 'loading'}</div>

        <div>isAnonymous:</div>
        <div>{`${anonymous()}`}</div>
      </section>
    </div>
  );
};
