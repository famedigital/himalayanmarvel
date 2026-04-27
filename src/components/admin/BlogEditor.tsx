'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CloudinaryUpload from './CloudinaryUpload';
import GalleryManager from './GalleryManager';
import { FileText, Tag, Calendar, User, Save, X, Plus, Loader2 } from 'lucide-react';
import { Blog } from '@/lib/supabase/types';

interface BlogEditorProps {
  blog?: Blog;
  isEdit?: boolean;
}

const CATEGORIES = [
  'Tour Update',
  'Travel Tips',
  'Bhutan Culture',
  'Festival Guide',
  'Trekking Adventures',
  'General',
];

export default function BlogEditor({ blog, isEdit = false }: BlogEditorProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  // Basic info
  const [title, setTitle] = useState(blog?.title || '');
  const [slug, setSlug] = useState(blog?.slug || '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '');
  const [content, setContent] = useState(blog?.content || '');
  const [author, setAuthor] = useState(blog?.author || 'Himalayan Marvels');
  const [category, setCategory] = useState(blog?.category || '');
  const [isPublished, setIsPublished] = useState(blog?.is_published || false);

  // Images
  const [featuredImage, setFeaturedImage] = useState(blog?.featured_image || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(blog?.gallery_images || []);

  // Tags
  const [tags, setTags] = useState<string[]>(blog?.tags || []);
  const [newTag, setNewTag] = useState('');

  // SEO
  const [metaTitle, setMetaTitle] = useState(blog?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(blog?.meta_description || '');

  // Generate slug from title
  useEffect(() => {
    if (!isEdit && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
      // Auto-generate meta title if not set
      if (!metaTitle) {
        setMetaTitle(title);
      }
    }
  }, [title, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const blogData = {
        title,
        slug,
        excerpt,
        content,
        author,
        category,
        featured_image: featuredImage,
        gallery_images: galleryImages,
        tags,
        is_published: isPublished,
        published_at: isPublished && !blog?.published_at ? new Date().toISOString() : blog?.published_at,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt,
        updated_at: new Date().toISOString(),
      };

      if (isEdit && blog?.id) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', blog.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([{
            ...blogData,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Insert markdown helpers
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('blog-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const selection = text.substring(start, end);

    const newText =
      text.substring(0, start) + before + selection + after + text.substring(end);
    setContent(newText);

    textarea.focus();
    textarea.setSelectionRange(
      start + before.length,
      start + before.length + selection.length
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-900/70 mb-2">
              Blog Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              placeholder="e.g., A Journey to the Tiger's Nest"
              required
            />
          </div>

          {/* Slug */}
          <div className="md:col-span-2">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-900/70 mb-2">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              placeholder="e.g., journey-to-tigers-nest"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-900/70 mb-2">
              Author
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                placeholder="Author name"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-900/70 mb-2">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-white">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-white">{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div className="md:col-span-2">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-900/70 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-none"
              placeholder="Brief summary of the blog post..."
            />
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900/70 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-orange-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Image</h2>
        <CloudinaryUpload
          onUploadComplete={setFeaturedImage}
          onRemove={() => setFeaturedImage('')}
          value={featuredImage}
          label="Upload featured image"
          folder="himalayanmarvel/blog"
          size="md"
        />
      </div>

      {/* Content Editor */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Content</h2>

        {/* Markdown Toolbar */}
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
          <button
            type="button"
            onClick={() => insertMarkdown('# ', '')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-bold transition-colors"
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('## ', '')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-bold transition-colors"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('**', '**')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-bold transition-colors"
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('*', '*')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm italic transition-colors"
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('[', '](url)')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm transition-colors"
            title="Link"
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('\n> ', '')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm transition-colors"
            title="Quote"
          >
            Quote
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('- ', '')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm transition-colors"
            title="List"
          >
            List
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('`', '`')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-mono transition-colors"
            title="Code"
          >
            &lt;/&gt;
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('\n![alt](', ')')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm transition-colors"
            title="Image"
          >
            📷
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('\n---\n', '')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm transition-colors"
            title="Horizontal Rule"
          >
            ―
          </button>
        </div>

        {/* Content Textarea */}
        <textarea
          id="blog-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-y font-mono text-sm"
          placeholder="Write your blog content here... (Markdown supported)"
          required
        />

        <p className="mt-3 text-gray-900/50 text-sm">
          Tip: You can use Markdown syntax for formatting. Use the toolbar above to quickly insert formatting.
        </p>
      </div>

      {/* Gallery Images */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Gallery Images</h2>
        <GalleryManager
          images={galleryImages}
          onChange={setGalleryImages}
          folder="himalayanmarvel/blog"
        />
      </div>

      {/* SEO Settings */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO Settings</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-900/70 mb-2">
              Meta Title
            </label>
            <input
              id="metaTitle"
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              placeholder="SEO title (defaults to blog title)"
            />
            <p className="text-gray-900/30 text-xs mt-1">{metaTitle?.length || 0} characters (recommended: 50-60)</p>
          </div>

          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-900/70 mb-2">
              Meta Description
            </label>
            <textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-none"
              placeholder="SEO description (defaults to excerpt)"
            />
            <p className="text-gray-900/30 text-xs mt-1">{metaDescription?.length || 0} characters (recommended: 150-160)</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 bg-gray-50 text-orange-500 focus:ring-orange-500/50"
          />
          <span className="text-gray-900">Publish blog post</span>
        </label>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEdit ? 'Update Blog' : 'Publish Blog'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
