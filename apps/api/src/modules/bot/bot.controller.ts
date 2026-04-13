import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('webhook')
  async handleWebhook(
    @Headers('x-telegram-bot-api-secret-token') secretToken: string,
    @Body() update: any,
  ) {
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (expectedSecret && secretToken !== expectedSecret) {
      throw new UnauthorizedException();
    }
    await this.botService.handleUpdate(update);
    return { ok: true };
  }
}
