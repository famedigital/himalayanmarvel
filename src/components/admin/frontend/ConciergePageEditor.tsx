'use client';

import { useState } from 'react';
import { FileText, Users, Code, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageInput } from '../form/ImageInput';
import { toast } from 'sonner';

interface ConciergeSection {
  id: string;
  name: string;
  icon: any;
}

const CONCIERGE_SECTIONS: ConciergeSection[] = [
  { id: 'hero', name: 'Hero Section', icon: FileText },
  { id: 'process', name: 'Process Steps', icon: Code },
  { id: 'services', name: 'Services', icon: Award },
  { id: 'form', name: 'Contact Form', icon: Users },
];

interface ConciergePageEditorProps {
  initialData?: any;
  onSave: (key: string, value: any) => void;
}

export default function ConciergePageEditor({
  initialData,
  onSave,
}: ConciergePageEditorProps) {
  const [selectedSection, setSelectedSection] = useState(CONCIERGE_SECTIONS[0]);

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
              {CONCIERGE_SECTIONS.map((section) => {
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
              const section = CONCIERGE_SECTIONS.find(s => s.id === e.target.value);
              if (section) setSelectedSection(section);
            }}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {CONCIERGE_SECTIONS.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Panel */}
        <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-900">
          <div className="h-full overflow-y-auto p-4 lg:p-8">
            {selectedSection.id === 'hero' && (
              <ConciergeHeroEditor initialData={initialData?.concierge_page_hero} onSave={onSave} />
            )}
            {selectedSection.id === 'process' && (
              <ConciergeProcessEditor initialData={initialData?.concierge_page_process} onSave={onSave} />
            )}
            {selectedSection.id === 'services' && (
              <ConciergeServicesEditor initialData={initialData?.concierge_page_services} onSave={onSave} />
            )}
            {selectedSection.id === 'form' && (
              <ConciergeFormEditor initialData={initialData?.concierge_page_form} onSave={onSave} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConciergeHeroEditor({ initialData, onSave }: any) {
  const [data, setData] = useState(initialData || { title: '', subtitle: '', image: '' });
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Hero Section</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Main hero content</p>
        </div>
        <button
          onClick={async () => { setSaving(true); await onSave('concierge_page_hero', data); setSaving(false); toast.success('Saved'); }}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <ImageInput
        value={data.image}
        onChange={(url) => setData({ ...data, image: url })}
        onRemove={() => setData({ ...data, image: '' })}
        label="Hero Image"
        folder="himalayanmarvel/concierge"
      />

      <input
        type="text"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
        placeholder="Hero Title"
      />

      <textarea
        value={data.subtitle}
        onChange={(e) => setData({ ...data, subtitle: e.target.value })}
        rows={3}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none transition-all"
        placeholder="Hero Subtitle"
      />
    </div>
  );
}

function ConciergeProcessEditor({ initialData, onSave }: any) {
  const [steps, setSteps] = useState(initialData?.steps || [{ title: '', description: '' }]);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Process Steps</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">How our concierge service works</p>
        </div>
        <button
          onClick={async () => { setSaving(true); await onSave('concierge_page_process', { steps }); setSaving(false); toast.success('Saved'); }}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((step: any, i: number) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={step.title}
              onChange={(e) => {
                const newSteps = [...steps];
                newSteps[i] = { ...step, title: e.target.value };
                setSteps(newSteps);
              }}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg mb-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder={`Step ${i + 1} Title`}
            />
            <textarea
              value={step.description}
              onChange={(e) => {
                const newSteps = [...steps];
                newSteps[i] = { ...step, description: e.target.value };
                setSteps(newSteps);
              }}
              rows={2}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Step description"
            />
          </div>
        ))}
        <button
          onClick={() => setSteps([...steps, { title: '', description: '' }])}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-amber-500 hover:text-amber-500 transition-colors font-medium"
        >
          + Add Step
        </button>
      </div>
    </div>
  );
}

function ConciergeServicesEditor({ initialData, onSave }: any) {
  const [data, setData] = useState(initialData || { title: '', services: [''] });
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">List of services offered</p>
        </div>
        <button
          onClick={async () => { setSaving(true); await onSave('concierge_page_services', data); setSaving(false); toast.success('Saved'); }}
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
        placeholder="Section Title"
      />

      <textarea
        value={data.services.join('\n')}
        onChange={(e) => setData({ ...data, services: e.target.value.split('\n') })}
        rows={8}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
        placeholder="One service per line"
      />
    </div>
  );
}

function ConciergeFormEditor({ initialData, onSave }: any) {
  const [data, setData] = useState(initialData || { buttonText: '', successMessage: '' });
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Form</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Form configuration</p>
        </div>
        <button
          onClick={async () => { setSaving(true); await onSave('concierge_page_form', data); setSaving(false); toast.success('Saved'); }}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <input
        type="text"
        value={data.buttonText}
        onChange={(e) => setData({ ...data, buttonText: e.target.value })}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        placeholder="Button Text (e.g., 'Start Planning')"
      />

      <textarea
        value={data.successMessage}
        onChange={(e) => setData({ ...data, successMessage: e.target.value })}
        rows={3}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
        placeholder="Success Message"
      />
    </div>
  );
}
