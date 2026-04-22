import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import TourForm from '@/components/admin/TourForm';

export default async function EditTourPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!tour) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Tour</h1>
        <p className="text-gray-500">Update tour package details</p>
      </div>

      <TourForm tour={tour} isEdit={true} />
    </div>
  );
}
