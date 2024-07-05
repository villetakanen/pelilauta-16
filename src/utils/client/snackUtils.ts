import type { SnackbarMessage } from '@11thdeg/cyan-next';
import { logDebug } from '@utils/logHelpers';
import { log } from 'node_modules/astro/dist/core/logger/core';

export function pushSessionSnack(snack: string | SnackbarMessage) {
  const message = typeof snack === 'string' ? { message: snack } : snack;
  window.sessionStorage.setItem('snack', JSON.stringify(message));
  logDebug('Session snack pushed', message);
}
