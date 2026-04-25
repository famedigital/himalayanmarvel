import BankDetailsManager from '@/components/admin/BankDetailsManager';

export default function BankDetailsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Settings</h1>
        <p className="text-gray-500">Manage payment information for bookings</p>
      </div>

      <BankDetailsManager />
    </div>
  );
}
