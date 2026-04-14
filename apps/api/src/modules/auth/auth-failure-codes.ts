/** Нормализованные причины отказа auth (логи / разбор инцидентов). */
export const AuthFailureCode = {
  ENV_MISSING: 'env_missing',
  MINI_APP_INVALID: 'mini_app_invalid',
  WIDGET_SIGNATURE_INVALID: 'widget_signature_invalid',
  DB_UPSERT_FAILED: 'db_upsert_failed',
} as const;

export type AuthFailureCode =
  (typeof AuthFailureCode)[keyof typeof AuthFailureCode];
