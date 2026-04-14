import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/** Обязательные переменные для старта API и CLI миграций (корневой `.env` или CI env). */
export const REQUIRED_ENV_KEYS = [
  'TELEGRAM_BOT_TOKEN',
  'JWT_SECRET',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
] as const;

/**
 * Корень монорепозитория (родитель `apps/`).
 * Путь считается от расположения этого файла (`src/config` или `dist/config`).
 */
export function resolveMonorepoRoot(): string {
  return path.resolve(__dirname, '../../../..');
}

export interface LoadRootEnvResult {
  /** Абсолютный путь к загруженному `.env`, если файл существовал */
  dotenvPath: string | null;
  /** `true`, если выполнен `dotenv.config` по файлу без ошибки */
  loadedFromFile: boolean;
}

/**
 * Загружает переменные из **корневого** `.env` репозитория (если файл есть).
 * `apps/api/.env` не используется и не требуется.
 */
export function loadRootEnv(): LoadRootEnvResult {
  const root = resolveMonorepoRoot();
  const envPath = path.join(root, '.env');
  if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath });
    return {
      dotenvPath: envPath,
      loadedFromFile: !result.error,
    };
  }
  dotenv.config();
  return { dotenvPath: null, loadedFromFile: false };
}

export function validateRequiredEnv(): void {
  const missing: string[] = [];
  for (const key of REQUIRED_ENV_KEYS) {
    const v = process.env[key];
    if (v === undefined || String(v).trim() === '') {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `Отсутствуют обязательные переменные окружения: ${missing.join(', ')}. Заполните корневой .env репозитория или задайте их в окружении процесса (CI).`,
    );
  }
}

export function logConfigSource(log: (line: string) => void): void {
  const root = resolveMonorepoRoot();
  const envPath = path.join(root, '.env');
  if (fs.existsSync(envPath)) {
    log(`Конфигурация: загружен корневой .env (${envPath})`);
  } else {
    log(
      `Конфигурация: файл ${envPath} не найден; используются переменные процесса (например CI). Репозиторий: ${root}`,
    );
  }
}
