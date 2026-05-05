/**
 * Years of Service Utility
 *
 * Automatically calculates years of service based on the founding year.
 * This ensures the "13+ years" text updates automatically each year.
 *
 * Founded: 2013
 * - 2026: 13+ years
 * - 2027: 14+ years
 * - etc.
 */

const FOUNDING_YEAR = 2013;

/**
 * Get the number of years since founding
 * @returns {number} Years of service
 */
export function getYearsOfService(): number {
  const currentYear = new Date().getFullYear();
  return currentYear - FOUNDING_YEAR;
}

/**
 * Get formatted years string with "+" suffix
 * @returns {string} Formatted string like "13+" or "14+"
 */
export function getYearsOfServiceString(): string {
  return `${getYearsOfService()}+`;
}

/**
 * Get full years text
 * @returns {string} Full text like "13+ Years"
 */
export function getYearsOfServiceText(): string {
  return `${getYearsOfServiceString()} Years`;
}
