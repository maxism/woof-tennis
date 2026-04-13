import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BotService } from '../bot/bot.service';

@Injectable()
export class TelegramNotifierService {
  constructor(
    @Inject(forwardRef(() => BotService))
    private readonly botService: BotService,
  ) {}

  async sendNotification(
    telegramId: number,
    title: string,
    body: string,
  ): Promise<void> {
    try {
      await this.botService.sendMessage(
        telegramId,
        `*${title}*\n${body}`,
      );
    } catch (error: any) {
      console.error(
        `Failed to send TG notification to ${telegramId}:`,
        error.message,
      );
    }
  }
}
