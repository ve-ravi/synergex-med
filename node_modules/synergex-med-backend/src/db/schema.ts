import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';

// Enums
export const appointmentTypeEnum = pgEnum('appointment_type', [
  'in-person',
  'telemedicine',
]);

export const clinicLocationEnum = pgEnum('clinic_location', [
  'Anaheim',
  'Culver City',
  'Downey',
  'El Monte',
  'Long Beach',
  'Los Angeles',
]);

export const referralStatusEnum = pgEnum('referral_status', [
  'new',
  'reviewed',
  'accepted',
  'rejected',
]);

// Referrals Table
export const referrals = pgTable(
  'referrals',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Patient Information
    patientFirstName: varchar('patient_first_name', { length: 100 }).notNull(),
    patientLastName: varchar('patient_last_name', { length: 100 }).notNull(),
    patientDateOfBirth: text('patient_date_of_birth').notNull(), // YYYY-MM-DD format
    patientPhone: varchar('patient_phone', { length: 20 }).notNull(),
    patientEmail: varchar('patient_email', { length: 255 }),

    // Attorney Information
    lawFirmName: varchar('law_firm_name', { length: 255 }).notNull(),
    attorneyName: varchar('attorney_name', { length: 100 }).notNull(),
    attorneyEmail: varchar('attorney_email', { length: 255 }).notNull(),
    attorneyPhone: varchar('attorney_phone', { length: 20 }).notNull(),

    // Referral Details
    primaryComplaint: text('primary_complaint').notNull(),
    preferredLocation: clinicLocationEnum('preferred_location').notNull(),
    appointmentType: appointmentTypeEnum('appointment_type').notNull(),

    // Metadata
    status: referralStatusEnum('status').default('new').notNull(),
    adminNotes: text('admin_notes'),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    attorneyEmailIdx: index('attorney_email_idx').on(table.attorneyEmail),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
    statusIdx: index('status_idx').on(table.status),
  })
);

// Type inference
export type ReferralInsert = typeof referrals.$inferInsert;
export type ReferralSelect = typeof referrals.$inferSelect;
