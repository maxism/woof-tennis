import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(BotService.name);

  async onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN not set, bot disabled');
      return;
    }

    this.bot = new Telegraf(token);
    this.setupHandlers();

    if (process.env.NODE_ENV === 'production') {
      const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
      const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
      if (webhookUrl) {
        await this.bot.telegram.setWebhook(webhookUrl, {
          secret_token: secret || undefined,
        });
        this.logger.log(`Webhook set to ${webhookUrl}`);
      }
    }
  }

  private setupHandlers() {
    const miniAppUrl = process.env.TELEGRAM_MINI_APP_URL || '';

    this.bot.start(async (ctx) => {
      const startPayload = ctx.startPayload;

      if (startPayload?.startsWith('play_')) {
        const inviteCode = startPayload.replace('play_', '');
        await ctx.reply('Вас пригласили на теннис! 🎾', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Открыть в WoofTennis',
                  web_app: {
                    url: `${miniAppUrl}?startapp=play_${inviteCode}`,
                  },
                },
              ],
            ],
          },
        });
      } else {
        await ctx.reply(
          'Добро пожаловать в WoofTennis! 🎾\nБронируйте теннисные тренировки прямо из Telegram.',
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Открыть WoofTennis',
                    web_app: { url: miniAppUrl },
                  },
                ],
              ],
            },
          },
        );
      }
    });
  }

  async handleUpdate(update: any): Promise<void> {
    if (!this.bot) return;
    await this.bot.handleUpdate(update);
  }

  async sendMessage(
    chatId: number,
    text: string,
    parseMode: 'Markdown' | 'HTML' = 'Markdown',
  ): Promise<void> {
    if (!this.bot) return;
    await this.bot.telegram.sendMessage(chatId, text, {
      parse_mode: parseMode,
    });
  }
}
