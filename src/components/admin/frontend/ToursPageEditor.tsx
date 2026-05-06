'use client';

import { useState } from 'react';
import { Layout, Settings, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ToursSection {
  id: string;
  name: string;
  icon: any;
}

const TOURS_SECTIONS: ToursSection[] = [
  { id: 'content', name: 'Page Content', icon: Layout },
  { id: 'layout', name: 'Layout Options', icon: Settings },
  { id: 'filters', name: 'Filters', icon: List },
];

interface ToursPageEditorProps {
  initialData?: any;
  onSave: (key: string, value: any) => void;
}

export default function ToursPageEditor({
  initialData,
  onSave,
}: ToursPageEditorProps) {
  const [selectedSection, setSelectedSection] = useState(TOURS_SECTIONS[0]);

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px] lg:h-[calc(100vh-240px)]">
        {/* Left Panel - Hidden on Mobile */}
        <div className="hidden lg:block lg:col-span-1 border-r border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-b from-gray-50/50 to-gray-100/50 dark:from-gray-950/50 dark:to-gray-900/50">
          <div className="h-full overflow-y-auto">
            <div className="p-5 space-y-1.5">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-5 px-2">
                Sections
              </h3>
              {TOURS_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = selectedSection.id === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section)}
                    className={cn(
                      'w-full text-left p-3 rounded-xl transition-all duration-200',
                      'hover:scale-[1.02] active:scale-[0.98]',
                      'flex items-center gap-3 group',
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                        : 'hover:bg-white dark:hover:bg-gray-800'
                    )}
                  >
                    <Icon className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-amber-500'
                    )} />
                    <span className="font-medium text-sm">{section.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Section Selector */}
        <div className="lg:hidden col-span-1 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
            Select Section
          </label>
          <select
            value={selectedSection.id}
            onChange={(e) => {
              const section = TOURS_SECTIONS.find(s => s.id === e.target.value);
              if (section) setSelectedSection(section);
            }}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {TOURS_SECTIONS.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Panel */}
        <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-900">
          <div className="h-full overflow-y-auto p-4 lg:p-8">
            {selectedSection.id === 'content' && (
              <ToursContentEditor initialData={initialData?.tours_page_content} onSave={onSave} />
            )}
            {selectedSection.id === 'layout' && (
              <ToursLayoutEditor initialData={initialData?.tours_page_layout} onSave={onSave} />
            )}
            {selectedSection.id === 'filters' && (
              <ToursFiltersEditor initialData={initialData?.tours_page_filters} onSave={onSave} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToursContentEditor({ initialData, onSave }: any) {
  const [data, setData] = useState(initialData || { title: '', description: '', emptyMessage: '' });
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Page Content</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Titles and descriptions</p>
        </div>
        <button
          onClick={async () => { setSaving(true); await onSave('tours_page_content', data); setSaving(false); toast.success('Saved'); }}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <input
        type="text"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        placeholder="Page Title (e.g., 'Our Tours')"
      />

      <textarea
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        rows={3}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
        placeholder="Page Description"
      />

      <input
        type="text"
        value={data.emptyMessage}
        onChange={(e) => setData({ ...data, emptyMessage: e.target.value })}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        placeholder="Empty State Message (e.g., 'No tours available')"
      />
    </div>
  );
}

function ToursLayoutEditor({ initialData, onSave }: any) {
  const [data, setData] = useState(initialData || { gridColumns: 3, cardStyle: 'modern' });
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Layout Options</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Grid and card styling</p>
        </div>
        <button
          onClick={async () => { setSaving(true); await onSave('tours_page_layout', data); setSaving(false); toast.success('Saved'); }}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Grid Columns: {data.gridColumns}
        </label>
        <input
          type="range"
          min={2}
          max={4}
          value={data.gridColumns}
          onChange={(e) => setData({ ...data, gridColumns: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Card Style
        </label>
        <select
          value={data.cardStyle}
          onChange={(e) => setData({ ...data, cardStyle: e.target.value })}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        >
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>
    </div>
  );
}

function ToursFiltersEditor({ initialData, onSave }: any) {
  const [data, setData] = useState(initialData || { showFilters: true, filterLabels: { duration: 'Duration', price: 'Price' } });
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Filter Options</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure filters and labels</p>
        </div>
        <button
          onClick={async () => { setSaving(true); await onSave('tours_page_filters', data); setSaving(false); toast.success('Saved'); }}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={data.showFilters}
          onChange={(e) => setData({ ...data, showFilters: e.target.checked })}
          className="w-5 h-5 text-amber-500 rounded"
        />
        <span className="font-medium text-gray-900 dark:text-white">Show Filters</span>
      </label>

      <input
        type="text"
        value={data.filterLabels.duration}
        onChange={(e) => setData({ ...data, filterLabels: { ...data.filterLabels, duration: e.target.value } })}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        placeholder="Duration Filter Label"
      />

      <input
        type="text"
        value={data.filterLabels.price}
        onChange={(e) => setData({ ...data, filterLabels: { ...data.filterLabels, price: e.target.value } })}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        placeholder="Price Filter Label"
      />
    </div>
  );
}
