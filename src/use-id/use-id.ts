// ./use-id.ts

import { createEffect, createSignal, createUniqueId } from 'solid-js';
import { randomId } from '../utils/random-id';

export function useId(staticId?: string) {
  const solidId = createUniqueId();
  const [uuid, setUuid] = createSignal(solidId);

  createEffect(() => {
    setUuid(randomId());
  });

  if (typeof staticId === 'string') {
    return () => staticId;
  }

  if (typeof window === 'undefined') {
    return () => solidId;
  }

  return uuid;
}
