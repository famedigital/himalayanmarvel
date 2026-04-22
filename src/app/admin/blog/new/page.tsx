import BlogEditor from '@/components/admin/BlogEditor';

export default function NewBlogPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Write New Blog</h1>
        <p className="text-gray-500">Share your travel experiences</p>
      </div>

      <BlogEditor />
    </div>
  );
}
