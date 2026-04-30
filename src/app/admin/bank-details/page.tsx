import { redirect } from 'next/navigation';

export default function BankDetailsPage() {
  // Redirect to new Settings page with Company tab
  redirect('/admin/settings?tab=company');
}
