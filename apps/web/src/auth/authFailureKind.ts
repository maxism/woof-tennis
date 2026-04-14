export type AuthFailureKind =
  | 'unauthorized'
  | 'rate_limited'
  | 'server_error'
  | 'network'
  | 'client_error'
  | 'unknown';
