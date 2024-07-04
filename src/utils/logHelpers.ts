import { z } from 'zod';

export function logError(...args: unknown[]) {
  for (const arg of args) {
    if (arg instanceof z.ZodError) {
      logError(arg.issues);
    } else {
      console.error('🦑', ...args);
    }
  }
}

export function logWarn(...args: unknown[]) {
  console.warn('⚠️', ...args);
}
export function logDebug(...args: unknown[]) {
  console.debug('🐛', ...args);
}
