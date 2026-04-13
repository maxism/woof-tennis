import { applyDecorators, UseGuards } from '@nestjs/common';
import { CoachGuard } from '../guards/coach.guard';

export const CoachOnly = () => applyDecorators(UseGuards(CoachGuard));
