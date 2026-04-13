import { createHash, createHmac } from 'crypto';
import {
  buildLoginWidgetDataCheckString,
  validateTelegramLoginWidget,
} from './telegram-login-widget.util';

describe('telegram-login-widget.util', () => {
  const botToken = '123456:ABC-DEF';

  function signPayload(
    p: Omit<
      Parameters<typeof validateTelegramLoginWidget>[0],
      'hash'
    >,
  ): string {
    const dataCheckString = buildLoginWidgetDataCheckString({
      ...p,
      hash: '',
    });
    const secretKey = createHash('sha256').update(botToken).digest();
    return createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  }

  it('accepts valid signature and fresh auth_date', () => {
    const authDate = Math.floor(Date.now() / 1000);
    const base = {
      id: 999001,
      first_name: 'Test',
      auth_date: authDate,
    };
    const hash = signPayload(base);
    const user = validateTelegramLoginWidget({ ...base, hash }, botToken);
    expect(user).toEqual({
      id: 999001,
      first_name: 'Test',
      last_name: undefined,
      username: undefined,
      photo_url: undefined,
    });
  });

  it('includes optional fields in data-check-string order', () => {
    const authDate = Math.floor(Date.now() / 1000);
    const base = {
      id: 42,
      first_name: 'A',
      auth_date: authDate,
      username: 'u',
      last_name: 'B',
    };
    const hash = signPayload(base);
    expect(
      validateTelegramLoginWidget({ ...base, hash }, botToken),
    ).toMatchObject({ id: 42, username: 'u', last_name: 'B' });
  });

  it('rejects wrong hash', () => {
    const authDate = Math.floor(Date.now() / 1000);
    expect(
      validateTelegramLoginWidget(
        {
          id: 1,
          first_name: 'X',
          auth_date: authDate,
          hash: 'deadbeef',
        },
        botToken,
      ),
    ).toBeNull();
  });

  it('rejects stale auth_date', () => {
    const authDate = Math.floor(Date.now() / 1000) - 86400 - 120;
    const base = {
      id: 7,
      first_name: 'Old',
      auth_date: authDate,
    };
    const hash = signPayload(base);
    expect(validateTelegramLoginWidget({ ...base, hash }, botToken)).toBeNull();
  });
});
