import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user (shouldn't happen due to middleware, but just in case), render without sidebar
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
