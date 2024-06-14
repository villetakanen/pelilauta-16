import { useStore } from '@nanostores/solid';
import type { Component } from 'solid-js';
import { $account, $loadingState, requiresEula } from 'src/stores/sessionStore';

export const DebugSection: Component = () => {
  const loadingState = useStore($loadingState);
  const eulaAccepted = useStore(requiresEula);
  const account = useStore($account);

  return (
    <div class="debug">
      <section class="field-grid">
        <div>loadingState:</div>
        <div>{loadingState()}</div>
        <div>requiresEula:</div>
        <div>{`${eulaAccepted()}`}</div>
        <div>showAdminTools:</div>
        <div>{`${account().showAdminTools}`}</div>
      </section>
    </div>
  );
};
