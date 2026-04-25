'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Loader2 } from 'lucide-react';

interface AboutContent {
  name: string;
  subtitle: string;
  bio: string;
  credentials: string;
  brands: string;
  stats: string;
  image: string;
}

export default function SettingsPage() {
  const supabase = createClient();
  const [aboutContentId, setAboutContentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [content, setContent] = useState<AboutContent>({
    name: 'Bivatsu Giri',
    subtitle: 'Founder & CEO',
    bio: 'A hospitality visionary whose professional DNA was forged in the world\'s most demanding luxury environments.',
    credentials: 'Les Roches (Spain), ICHM (Australia), MBA - University of Canberra',
    brands: 'The Ritz-Carlton, Hyatt, Kempinski',
    stats: '12+|5,000+|50+|4.9',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776275660/founder-portrait_pbo8m4.jpg',
  });

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from('settings')
        .select('id, value')
        .eq('key', 'about_content')
        .single();

      if (data?.id) {
        setAboutContentId(data.id);
      }

      if (data?.value) {
        setContent(data.value);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const timestamp = new Date().toISOString();

      if (aboutContentId) {
        const { error: updateError } = await supabase
          .from('settings')
          .update({
            value: content,
            updated_at: timestamp,
          })
          .eq('id', aboutContentId);

        if (updateError) throw updateError;
      } else {
        const { data: insertedRow, error: insertError } = await supabase
          .from('settings')
          .insert({
            key: 'about_content',
            value: content,
            updated_at: timestamp,
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        if (insertedRow?.id) {
          setAboutContentId(insertedRow.id);
        }
      }

      alert('About page content saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About Page Editor</h1>
        <p className="text-gray-500">Edit the content that appears on the About section</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
        {/* Personal Info */}
        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-900/70 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={content.name}
                onChange={(e) => setContent({ ...content, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-900/70 mb-2">
                Subtitle
              </label>
              <input
                id="subtitle"
                type="text"
                value={content.subtitle}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-900/70 mb-2">
                Photo URL
              </label>
              <input
                id="image"
                type="text"
                value={content.image}
                onChange={(e) => setContent({ ...content, image: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Biography</h2>

          <textarea
            value={content.bio}
            onChange={(e) => setContent({ ...content, bio: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-none"
            placeholder="Write the biography text..."
          />
        </div>

        {/* Credentials */}
        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Credentials & Education</h2>

          <label htmlFor="credentials" className="block text-sm font-medium text-gray-900/70 mb-2">
            Credentials (comma-separated)
          </label>
          <input
            id="credentials"
            type="text"
            value={content.credentials}
            onChange={(e) => setContent({ ...content, credentials: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all mb-4"
            placeholder="Les Roches (Spain), ICHM (Australia), MBA - University of Canberra"
          />

          <label htmlFor="brands" className="block text-sm font-medium text-gray-900/70 mb-2">
            Luxury Brands (comma-separated)
          </label>
          <input
            id="brands"
            type="text"
            value={content.brands}
            onChange={(e) => setContent({ ...content, brands: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
            placeholder="The Ritz-Carlton, Hyatt, Kempinski"
          />
        </div>

        {/* Stats */}
        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistics (Experience, Travelers, Tours, Rating)</h2>

          <label htmlFor="stats" className="block text-sm font-medium text-gray-900/70 mb-2">
            Stats (pipe-separated: Experience|Travelers|Tours|Rating)
          </label>
          <input
            id="stats"
            type="text"
            value={content.stats}
            onChange={(e) => setContent({ ...content, stats: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
            placeholder="12+|5,000+|50+|4.9"
          />
          <p className="text-sm text-gray-500 mt-2">Format: Years|Travelers|Tours|Rating</p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
