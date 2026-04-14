import {
  REQUIRED_ENV_KEYS,
  validateRequiredEnv,
} from './load-root-env';

describe('load-root-env / validateRequiredEnv', () => {
  const snapshot: NodeJS.ProcessEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...snapshot };
  });

  it('throws listing missing keys when vars empty', () => {
    for (const key of REQUIRED_ENV_KEYS) {
      delete process.env[key];
    }
    expect(() => validateRequiredEnv()).toThrow(/Отсутствуют обязательные переменные/);
    expect(() => validateRequiredEnv()).toThrow(/TELEGRAM_BOT_TOKEN/);
  });

  it('passes when all required keys are set', () => {
    for (const key of REQUIRED_ENV_KEYS) {
      process.env[key] = 'x';
    }
    expect(() => validateRequiredEnv()).not.toThrow();
  });
});
