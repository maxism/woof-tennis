import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventInvites1714000000000 implements MigrationInterface {
  name = 'AddEventInvites1714000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "invite_status" AS ENUM ('pending', 'accepted', 'declined', 'expired')
    `);

    await queryRunner.query(`
      CREATE TABLE "event_invites" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "slotId" uuid NOT NULL,
        "coachId" uuid NOT NULL,
        "playerId" uuid,
        "code" varchar(64) NOT NULL,
        "status" "invite_status" NOT NULL DEFAULT 'pending',
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_event_invites" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_event_invite_code" UNIQUE ("code"),
        CONSTRAINT "FK_event_invites_slot" FOREIGN KEY ("slotId") REFERENCES "slots"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_event_invites_coach" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_event_invites_player" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_event_invite_slot_id" ON "event_invites" ("slotId")`);
    await queryRunner.query(`CREATE INDEX "IDX_event_invite_coach_id" ON "event_invites" ("coachId")`);
    await queryRunner.query(`CREATE INDEX "IDX_event_invite_player_id" ON "event_invites" ("playerId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "event_invites" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "invite_status"`);
  }
}
