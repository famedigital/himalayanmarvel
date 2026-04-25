import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (!blog) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Blog</h1>
        <p className="text-gray-500">Update your blog post</p>
      </div>

      <BlogEditor blog={blog} isEdit={true} />
    </div>
  );
}
