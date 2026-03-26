/**
 * Utility functions for the backend
 */

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Clean phone number by removing non-digit characters
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Validate phone number has at least 10 digits
 */
export function isValidPhoneNumber(phone: string): boolean {
  const digits = cleanPhoneNumber(phone);
  return digits.length >= 10;
}

/**
 * Get display name from first and last name
 */
export function getDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}
