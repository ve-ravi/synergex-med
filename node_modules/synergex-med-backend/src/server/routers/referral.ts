import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { referralSchema } from '@/lib/schemas';
import { db } from '@/db';
import { referrals } from '@/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const referralRouter = router({
  /**
   * Submit a new referral (submitReferral mutation)
   * Accepts patient, attorney, and referral details
   * Validates input and inserts into database
   * Returns confirmation with ID and estimated follow-up time
   */
  submitReferral: publicProcedure
    .input(referralSchema)
    .mutation(async ({ input }) => {
      try {
        const newReferral = await db
          .insert(referrals)
          .values({
            patientFirstName: input.patientFirstName,
            patientLastName: input.patientLastName,
            patientDateOfBirth: input.patientDateOfBirth,
            patientPhone: input.patientPhone,
            patientEmail: input.patientEmail || null,
            lawFirmName: input.lawFirmName,
            attorneyName: input.attorneyName,
            attorneyEmail: input.attorneyEmail,
            attorneyPhone: input.attorneyPhone,
            primaryComplaint: input.primaryComplaint,
            preferredLocation: input.preferredLocation,
            appointmentType: input.appointmentType,
            status: 'new',
          })
          .returning();
        return {
          success: true,
          referralId: newReferral[0].id,
          message: 'Referral submitted successfully',
          estimatedFollowUp: 'Our team will contact the patient within 24 hours',
        };
      } catch (error) {
        console.error('Error creating referral:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to submit referral',
          cause: error,
        });
      }
    }),

  /**
   * List all referrals with pagination
   */
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(100).default(10),
        offset: z.number().int().nonnegative().default(0),
        status: z
          .enum(['new', 'reviewed', 'accepted', 'rejected'])
          .optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const whereConditions = input.status
          ? and(eq(referrals.status, input.status))
          : undefined;

        const data = await db.query.referrals.findMany({
          where: whereConditions,
          orderBy: desc(referrals.createdAt),
          limit: input.limit,
          offset: input.offset,
        });

        const countResult = await db
          .select({ count: count() })
          .from(referrals)
          .where(whereConditions);

        const total = countResult[0]?.count || 0;

        return {
          data,
          pagination: {
            total,
            limit: input.limit,
            offset: input.offset,
            pages: Math.ceil(total / input.limit),
          },
        };
      } catch (error) {
        console.error('Error listing referrals:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list referrals',
        });
      }
    }),
});
