import { emitAuthTelemetry } from './authTelemetry';
import { normalizeAuthFailure, type NormalizedAuthFailure } from './normalizeAuthFailure';
import { mapAuthFailureKindToUserMessage } from './mapAuthFailureToUserMessage';

export interface AuthFailureUiState {
  authError: string;
  authFailureKind: NormalizedAuthFailure['kind'];
  authRequestId: string | null;
}

export function buildAuthFailureState(
  error: unknown,
  endpoint: string,
): AuthFailureUiState {
  const normalized = normalizeAuthFailure(error, endpoint);
  emitAuthTelemetry(normalized, endpoint);
  return {
    authError: mapAuthFailureKindToUserMessage(normalized.kind),
    authFailureKind: normalized.kind,
    authRequestId: normalized.requestId ?? null,
  };
}
