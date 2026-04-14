import type { AuthFailureKind } from './authFailureKind';
import { t } from '@/utils/i18n';

/** Пользовательские RU-тексты (через i18n) по классу ошибки. */
export function mapAuthFailureKindToUserMessage(kind: AuthFailureKind): string {
  switch (kind) {
    case 'unauthorized':
      return t('error', 'authUnauthorized');
    case 'rate_limited':
      return t('error', 'authRateLimited');
    case 'server_error':
      return t('error', 'authServer');
    case 'network':
      return t('error', 'authNetwork');
    case 'client_error':
      return t('error', 'authClient');
    default:
      return t('error', 'authUnknown');
  }
}
