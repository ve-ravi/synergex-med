import { z } from 'zod';

export const referralSchema = z.object({
  // Patient Information
  patientFirstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name is too long')
    .trim(),
  patientLastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name is too long')
    .trim(),
  patientDateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  patientPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\-\+\s\(\)]+$/, 'Invalid phone number format'),
  patientEmail: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  // Attorney/Referring Information
  lawFirmName: z
    .string()
    .min(1, 'Law firm name is required')
    .max(255, 'Law firm name is too long')
    .trim(),
  attorneyName: z
    .string()
    .min(1, 'Attorney or case manager name is required')
    .max(100, 'Attorney name is too long')
    .trim(),
  attorneyEmail: z
    .string()
    .email('Invalid email address for attorney')
    .max(255, 'Email is too long')
    .trim(),
  attorneyPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\-\+\s\(\)]+$/, 'Invalid phone number format'),

  // Referral Details
  primaryComplaint: z
    .string()
    .min(1, 'Primary complaint is required')
    .max(500, 'Complaint must not exceed 500 characters')
    .trim(),

  preferredLocation: z.enum(
    [
      'Anaheim',
      'Culver City',
      'Downey',
      'El Monte',
      'Long Beach',
      'Los Angeles',
    ],
    {
      message: 'Please select a valid clinic location',
    }
  ),

  appointmentType: z.enum(['in-person', 'telemedicine'], {
    message: 'Please select a valid appointment type',
  }),
});

export type ReferralFormData = z.infer<typeof referralSchema>;
