import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { dataSourceOptions } from './config/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LocationsModule } from './modules/locations/locations.module';
import { ScheduleTemplatesModule } from './modules/schedule/schedule.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PlaySessionsModule } from './modules/play-sessions/play-sessions.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MakeupModule } from './modules/makeup/makeup.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BotModule } from './modules/bot/bot.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    LocationsModule,
    ScheduleTemplatesModule,
    BookingsModule,
    PlaySessionsModule,
    ReviewsModule,
    MakeupModule,
    NotificationsModule,
    BotModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
