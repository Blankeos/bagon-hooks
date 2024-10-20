/** Utility: gives a random id. */
export function randomId(customPrefix: string = 'bagon') {
  return `${customPrefix}-${Math.random().toString(36).slice(2, 11)}`;
}
