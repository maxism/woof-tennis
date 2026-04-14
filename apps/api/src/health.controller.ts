import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MigrationExecutor } from 'typeorm';

@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  /**
   * Readiness: БД доступна и нет неприменённых миграций.
   * Для оркестраторов / pre-traffic gate.
   */
  @Get('health/ready')
  async ready() {
    try {
      await this.dataSource.query('SELECT 1');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Readiness: database unavailable (${msg})`);
      throw new HttpException(
        {
          status: 'not_ready',
          reason: 'database_unavailable',
          message: 'База данных недоступна',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const executor = new MigrationExecutor(this.dataSource);
    let pending: Awaited<
      ReturnType<MigrationExecutor['getPendingMigrations']>
    >;
    try {
      pending = await executor.getPendingMigrations();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Readiness: migration check failed (${msg})`);
      throw new HttpException(
        {
          status: 'not_ready',
          reason: 'migration_check_failed',
          message: 'Не удалось проверить миграции',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (pending.length > 0) {
      const names = pending.map((m) => m.name);
      this.logger.warn(
        `Readiness: есть неприменённые миграции (${pending.length}): ${names.join(', ')}`,
      );
      throw new HttpException(
        {
          status: 'not_ready',
          reason: 'pending_migrations',
          pendingCount: pending.length,
          pendingNames: names,
          message: 'Схема БД неактуальна: выполните миграции',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }
}
