import { validateTelegramInitData } from './telegram-auth.util';

describe('telegram-auth.util', () => {
  const botToken = 'test:token';

  it('returns null when hash is missing', () => {
    expect(validateTelegramInitData('auth_date=1&user=%7B%22id%22%3A1%7D', botToken)).toBeNull();
  });

  it('returns null for garbage initData', () => {
    expect(validateTelegramInitData('not-a-valid-query', botToken)).toBeNull();
  });
});
