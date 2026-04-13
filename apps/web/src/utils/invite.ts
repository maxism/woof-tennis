/** Deep link start_param prefix for play sessions (docs/05-frontend-structure.md) */
export const PLAY_START_PREFIX = 'play_';

export function parsePlayInviteFromStartParam(
  startParam: string | undefined,
): string | null {
  if (!startParam?.startsWith(PLAY_START_PREFIX)) return null;
  return startParam.slice(PLAY_START_PREFIX.length);
}
