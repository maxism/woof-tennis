type QueryValue = string | number | boolean | null | undefined;

type QueryInput = Record<string, QueryValue>;

export function buildSafeQuery<K extends string>(
  input: QueryInput | undefined,
  allowedKeys: readonly K[],
): Partial<Record<K, string | number | boolean>> {
  if (!input) return {};

  const allowed = new Set<string>(allowedKeys);
  const out: Partial<Record<K, string | number | boolean>> = {};

  for (const [key, raw] of Object.entries(input)) {
    if (!allowed.has(key)) continue;
    if (raw == null) continue;

    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      out[key as K] = trimmed;
      continue;
    }

    if (typeof raw === 'number') {
      if (!Number.isFinite(raw)) continue;
      out[key as K] = raw;
      continue;
    }

    out[key as K] = raw;
  }

  return out;
}
