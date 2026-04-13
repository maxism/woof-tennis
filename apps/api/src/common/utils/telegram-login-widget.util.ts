import { createHash, createHmac } from 'crypto';
import {
  TELEGRAM_AUTH_MAX_AGE_SEC,
  TelegramUser,
} from './telegram-auth.util';

/** Поля тела Login Widget (snake_case), участвующие в подписи. */
export type TelegramLoginWidgetPayload = {
  id: number;
  first_name: string;
  auth_date: number;
  hash: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export function buildLoginWidgetDataCheckString(
  payload: TelegramLoginWidgetPayload,
): string {
  const row: Record<string, string | number> = {
    id: payload.id,
    first_name: payload.first_name,
    auth_date: payload.auth_date,
  };
  if (payload.last_name !== undefined) row.last_name = payload.last_name;
  if (payload.username !== undefined) row.username = payload.username;
  if (payload.photo_url !== undefined) row.photo_url = payload.photo_url;

  return Object.keys(row)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => `${key}=${row[key]}`)
    .join('\n');
}

export function validateTelegramLoginWidget(
  payload: TelegramLoginWidgetPayload,
  botToken: string,
  maxAuthAgeSec: number = TELEGRAM_AUTH_MAX_AGE_SEC,
): TelegramUser | null {
  const dataCheckString = buildLoginWidgetDataCheckString(payload);
  const secretKey = createHash('sha256').update(botToken).digest();
  const computedHash = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (computedHash !== payload.hash) {
    return null;
  }

  const authDate = Number(payload.auth_date);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(authDate) || now - authDate > maxAuthAgeSec) {
    return null;
  }

  return {
    id: Number(payload.id),
    first_name: payload.first_name,
    last_name: payload.last_name,
    username: payload.username,
    photo_url: payload.photo_url,
  };
}
