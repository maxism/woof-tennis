import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandEventInviteAndLocations1715000000000 implements MigrationInterface {
  name = 'ExpandEventInviteAndLocations1715000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "event_invites"
      ADD COLUMN "targetTelegramNames" jsonb NOT NULL DEFAULT '[]'
    `);

    await queryRunner.query(`
      ALTER TABLE "locations"
      ADD COLUMN "description" text
    `);

    await queryRunner.query(`
      ALTER TABLE "locations"
      ADD COLUMN "website" varchar(500)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "locations"
      DROP COLUMN IF EXISTS "website"
    `);

    await queryRunner.query(`
      ALTER TABLE "locations"
      DROP COLUMN IF EXISTS "description"
    `);

    await queryRunner.query(`
      ALTER TABLE "event_invites"
      DROP COLUMN IF EXISTS "targetTelegramNames"
    `);
  }
}
