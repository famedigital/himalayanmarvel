/**
 * Public contact email configuration.
 * Domain mailbox (info@himalayanmarvels.com) is toggled OFF —
 * inbound mail is not reaching Gmail from that address.
 * Active contact: info.himalayanmarvels@gmail.com
 */

export const DOMAIN_EMAIL = 'info@himalayanmarvels.com';
export const GMAIL_CONTACT_EMAIL = 'info.himalayanmarvels@gmail.com';

/** When false, site uses Gmail contact instead of the domain mailbox */
export const DOMAIN_EMAIL_ENABLED = false;

export const PRIMARY_CONTACT_EMAIL = DOMAIN_EMAIL_ENABLED
  ? DOMAIN_EMAIL
  : GMAIL_CONTACT_EMAIL;

export function contactMailto(subject?: string): string {
  const base = `mailto:${PRIMARY_CONTACT_EMAIL}`;
  if (!subject) return base;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}
