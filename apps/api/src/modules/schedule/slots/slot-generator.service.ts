import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlotSource, SlotStatus } from '@wooftennis/shared';
import { SlotEntity } from './entities/slot.entity';
import { TemplatesService } from '../templates/templates.service';

@Injectable()
export class SlotGeneratorService {
  constructor(
    @InjectRepository(SlotEntity)
    private readonly slotRepo: Repository<SlotEntity>,
    private readonly templatesService: TemplatesService,
  ) {}

  async generateForCoach(
    coachId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<{ generated: number; skipped: number }> {
    const templates = await this.templatesService.findActiveByCoach(coachId);

    let generated = 0;
    let skipped = 0;

    const current = new Date(dateFrom);
    while (current <= dateTo) {
      const jsDay = current.getDay();
      // Convert JS day (0=Sun) to our system (0=Mon)
      const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

      const matchingTemplates = templates.filter(
        (t) => t.dayOfWeek === dayOfWeek,
      );

      for (const template of matchingTemplates) {
        const slots = this.splitIntoSlots(
          template.startTime,
          template.endTime,
          template.slotDurationMinutes,
        );

        for (const slot of slots) {
          const dateStr = current.toISOString().split('T')[0];

          const exists = await this.slotRepo.findOne({
            where: {
              coachId,
              date: dateStr,
              startTime: slot.start,
            },
          });

          if (exists) {
            skipped++;
            continue;
          }

          const newSlot = this.slotRepo.create({
            coachId,
            locationId: template.locationId,
            templateId: template.id,
            date: dateStr,
            startTime: slot.start,
            endTime: slot.end,
            maxPlayers: template.maxPlayers,
            status: SlotStatus.Available,
            source: SlotSource.Template,
          });

          await this.slotRepo.save(newSlot);
          generated++;
        }
      }

      current.setDate(current.getDate() + 1);
    }

    return { generated, skipped };
  }

  private splitIntoSlots(
    startTime: string,
    endTime: string,
    durationMinutes: number,
  ): { start: string; end: string }[] {
    const slots: { start: string; end: string }[] = [];
    let [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const endTotalMinutes = endH * 60 + endM;

    while (true) {
      const currentTotal = startH * 60 + startM;
      const nextTotal = currentTotal + durationMinutes;

      if (nextTotal > endTotalMinutes) break;

      const nextH = Math.floor(nextTotal / 60);
      const nextM = nextTotal % 60;

      slots.push({
        start: `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
        end: `${String(nextH).padStart(2, '0')}:${String(nextM).padStart(2, '0')}`,
      });

      startH = nextH;
      startM = nextM;
    }

    return slots;
  }
}
