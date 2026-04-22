import TourForm from '@/components/admin/TourForm';

export default function NewTourPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Tour</h1>
        <p className="text-gray-500">Add a new tour package to your catalog</p>
      </div>

      <TourForm />
    </div>
  );
}
