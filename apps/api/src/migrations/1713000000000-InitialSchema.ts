import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1713000000000 implements MigrationInterface {
  name = 'InitialSchema1713000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enum types
    await queryRunner.query(`
      CREATE TYPE "slot_status" AS ENUM ('available', 'booked', 'full', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TYPE "slot_source" AS ENUM ('template', 'manual')
    `);
    await queryRunner.query(`
      CREATE TYPE "booking_status" AS ENUM ('confirmed', 'cancelled', 'completed', 'no_show')
    `);
    await queryRunner.query(`
      CREATE TYPE "play_session_status" AS ENUM ('open', 'confirmed', 'cancelled', 'completed')
    `);
    await queryRunner.query(`
      CREATE TYPE "participant_status" AS ENUM ('confirmed', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TYPE "makeup_status" AS ENUM ('pending', 'resolved', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TYPE "notification_type" AS ENUM (
        'booking_created', 'booking_cancelled', 'booking_reminder', 'booking_completed',
        'split_joined', 'slot_cancelled', 'review_received',
        'makeup_assigned', 'makeup_resolved', 'play_session_joined'
      )
    `);

    // Users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "telegramId" bigint NOT NULL,
        "firstName" varchar(100) NOT NULL,
        "lastName" varchar(100),
        "username" varchar(100),
        "photoUrl" varchar(500),
        "isCoach" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_telegram_id" UNIQUE ("telegramId")
      )
    `);

    // Locations
    await queryRunner.query(`
      CREATE TABLE "locations" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "coachId" uuid NOT NULL,
        "name" varchar(200) NOT NULL,
        "address" varchar(500) NOT NULL,
        "photoUrl" varchar(500),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_locations" PRIMARY KEY ("id"),
        CONSTRAINT "FK_locations_coach" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_location_coach_id" ON "locations" ("coachId")
    `);

    // Schedule Templates
    await queryRunner.query(`
      CREATE TABLE "schedule_templates" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "coachId" uuid NOT NULL,
        "locationId" uuid NOT NULL,
        "dayOfWeek" smallint NOT NULL,
        "startTime" time NOT NULL,
        "endTime" time NOT NULL,
        "slotDurationMinutes" smallint NOT NULL DEFAULT 60,
        "maxPlayers" smallint NOT NULL DEFAULT 1,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_schedule_templates" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_schedule_template_unique" UNIQUE ("coachId", "locationId", "dayOfWeek", "startTime"),
        CONSTRAINT "FK_schedule_templates_coach" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_schedule_templates_location" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE,
        CONSTRAINT "CHK_day_of_week" CHECK ("dayOfWeek" >= 0 AND "dayOfWeek" <= 6)
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_schedule_template_coach_id" ON "schedule_templates" ("coachId")`);
    await queryRunner.query(`CREATE INDEX "IDX_schedule_template_location_id" ON "schedule_templates" ("locationId")`);

    // Slots
    await queryRunner.query(`
      CREATE TABLE "slots" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "coachId" uuid NOT NULL,
        "locationId" uuid NOT NULL,
        "templateId" uuid,
        "date" date NOT NULL,
        "startTime" time NOT NULL,
        "endTime" time NOT NULL,
        "maxPlayers" smallint NOT NULL DEFAULT 1,
        "status" "slot_status" NOT NULL DEFAULT 'available',
        "source" "slot_source" NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_slots" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_slot_no_overlap" UNIQUE ("coachId", "date", "startTime"),
        CONSTRAINT "FK_slots_coach" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_slots_location" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_slots_template" FOREIGN KEY ("templateId") REFERENCES "schedule_templates"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_slot_coach_date" ON "slots" ("coachId", "date")`);
    await queryRunner.query(`CREATE INDEX "IDX_slot_location_date" ON "slots" ("locationId", "date")`);

    // Bookings
    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "slotId" uuid NOT NULL,
        "playerId" uuid NOT NULL,
        "status" "booking_status" NOT NULL DEFAULT 'confirmed',
        "isSplitOpen" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_booking_slot_player" UNIQUE ("slotId", "playerId"),
        CONSTRAINT "FK_bookings_slot" FOREIGN KEY ("slotId") REFERENCES "slots"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_bookings_player" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_booking_slot_id" ON "bookings" ("slotId")`);
    await queryRunner.query(`CREATE INDEX "IDX_booking_player_id" ON "bookings" ("playerId")`);

    // Play Sessions
    await queryRunner.query(`
      CREATE TABLE "play_sessions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "creatorId" uuid NOT NULL,
        "locationText" varchar(500) NOT NULL,
        "date" date NOT NULL,
        "startTime" time NOT NULL,
        "endTime" time,
        "comment" text,
        "inviteCode" varchar(20) NOT NULL,
        "status" "play_session_status" NOT NULL DEFAULT 'open',
        "maxPlayers" smallint NOT NULL DEFAULT 2,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_play_sessions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_play_session_invite_code" UNIQUE ("inviteCode"),
        CONSTRAINT "FK_play_sessions_creator" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_play_session_creator_id" ON "play_sessions" ("creatorId")`);
    await queryRunner.query(`CREATE INDEX "IDX_play_session_date" ON "play_sessions" ("date")`);

    // Play Session Participants
    await queryRunner.query(`
      CREATE TABLE "play_session_participants" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "playSessionId" uuid NOT NULL,
        "playerId" uuid NOT NULL,
        "status" "participant_status" NOT NULL DEFAULT 'confirmed',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_play_session_participants" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_participant_unique" UNIQUE ("playSessionId", "playerId"),
        CONSTRAINT "FK_psp_session" FOREIGN KEY ("playSessionId") REFERENCES "play_sessions"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_psp_player" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Reviews
    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "bookingId" uuid NOT NULL,
        "reviewerId" uuid NOT NULL,
        "targetId" uuid NOT NULL,
        "poopRating" smallint NOT NULL,
        "starRating" smallint NOT NULL,
        "recommendation" text,
        "comment" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_reviews" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_review_unique" UNIQUE ("bookingId", "reviewerId"),
        CONSTRAINT "FK_reviews_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_reviews_reviewer" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_reviews_target" FOREIGN KEY ("targetId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "CHK_poop_rating" CHECK ("poopRating" >= 1 AND "poopRating" <= 3),
        CONSTRAINT "CHK_star_rating" CHECK ("starRating" >= 1 AND "starRating" <= 3)
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_review_target_id" ON "reviews" ("targetId")`);

    // Makeup Debts
    await queryRunner.query(`
      CREATE TABLE "makeup_debts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "coachId" uuid NOT NULL,
        "playerId" uuid NOT NULL,
        "originalBookingId" uuid NOT NULL,
        "makeupBookingId" uuid,
        "reason" text,
        "status" "makeup_status" NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_makeup_debts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_makeup_debts_coach" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_makeup_debts_player" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_makeup_debts_original" FOREIGN KEY ("originalBookingId") REFERENCES "bookings"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_makeup_debts_makeup" FOREIGN KEY ("makeupBookingId") REFERENCES "bookings"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_makeup_debt_player_id" ON "makeup_debts" ("playerId")`);
    await queryRunner.query(`CREATE INDEX "IDX_makeup_debt_coach_id" ON "makeup_debts" ("coachId")`);

    // Notifications
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "type" "notification_type" NOT NULL,
        "title" varchar(200) NOT NULL,
        "body" text NOT NULL,
        "isRead" boolean NOT NULL DEFAULT false,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id"),
        CONSTRAINT "FK_notifications_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_notification_user_id_read" ON "notifications" ("userId", "isRead")`);
    await queryRunner.query(`CREATE INDEX "IDX_notification_created_at" ON "notifications" ("createdAt" DESC)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "makeup_debts" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "reviews" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "play_session_participants" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "play_sessions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bookings" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "slots" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "schedule_templates" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "locations" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);

    await queryRunner.query(`DROP TYPE IF EXISTS "notification_type"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "makeup_status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "participant_status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "play_session_status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "booking_status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "slot_source"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "slot_status"`);
  }
}
