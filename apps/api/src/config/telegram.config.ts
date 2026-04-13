export const telegramConfig = () => ({
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  webhookUrl: process.env.TELEGRAM_WEBHOOK_URL || '',
  webhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || '',
  miniAppUrl: process.env.TELEGRAM_MINI_APP_URL || '',
});
