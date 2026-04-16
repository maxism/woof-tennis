import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsRecurringToSlots1714000001000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE slots ADD COLUMN IF NOT EXISTS "isRecurring" boolean NOT NULL DEFAULT false`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE slots DROP COLUMN IF EXISTS "isRecurring"`);
  }
}
