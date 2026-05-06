'use client';

import { useState } from 'react';
import { User, Users, Award, Clock, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageInput } from '../form/ImageInput';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface AboutSection {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: 'story',
    name: 'Founder Story',
    icon: MessageSquare,
    description: 'The founder\'s journey and vision',
  },
  {
    id: 'team',
    name: 'Team Members',
    icon: Users,
    description: 'Meet our team',
  },
  {
    id: 'credentials',
    name: 'Credentials',
    icon: Award,
    description: 'Licenses and certifications',
  },
  {
    id: 'timeline',
    name: 'Timeline',
    icon: Clock,
    description: 'Company milestones',
  },
];

interface AboutPageEditorProps {
  initialData?: any;
  onSave: (key: string, value: any) => void;
}

export default function AboutPageEditor({
  initialData,
  onSave,
}: AboutPageEditorProps) {
  const [selectedSection, setSelectedSection] = useState(ABOUT_SECTIONS[0]);
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());

  const handleSectionChange = (section: AboutSection) => {
    if (unsavedChanges.has(selectedSection.id)) {
      const confirm = window.confirm(
        'You have unsaved changes. Save before switching?'
      );
      if (!confirm) return;
    }
    setSelectedSection(section);
  };

  const handleSave = async (data: any) => {
    await onSave(`about_page_${selectedSection.id}`, data);
    setUnsavedChanges((prev) => {
      const next = new Set(prev);
      next.delete(selectedSection.id);
      return next;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px] lg:h-[calc(100vh-280px)]">
        {/* Left Panel - Hidden on Mobile */}
        <div className="hidden lg:block lg:col-span-1 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
                About Page Sections
              </h3>
              {ABOUT_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = selectedSection.id === section.id;
                const hasUnsaved = unsavedChanges.has(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all duration-200',
                      'hover:bg-gray-200 dark:hover:bg-gray-800',
                      'flex items-start gap-3',
                      isActive &&
                        'bg-amber-500 text-white shadow-md hover:bg-amber-600'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 shrink-0 mt-0.5',
                        isActive ? 'text-white' : 'text-gray-400'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{section.name}</div>
                      <div
                        className={cn(
                          'text-xs mt-0.5',
                          isActive ? 'text-amber-100' : 'text-gray-500'
                        )}
                      >
                        {section.description}
                      </div>
                      {hasUnsaved && (
                        <div className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                          Unsaved changes
                        </div>
                      )}
                    </div>
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
              const section = ABOUT_SECTIONS.find(s => s.id === e.target.value);
              if (section) handleSectionChange(section);
            }}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {ABOUT_SECTIONS.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Panel */}
        <div className="col-span-1 lg:col-span-3">
          <div className="h-full overflow-y-auto">
            <div className="p-4 lg:p-6">
              {selectedSection.id === 'story' && (
                <FounderStoryEditor
                  initialData={initialData?.about_page_story}
                  onSave={handleSave}
                />
              )}
              {selectedSection.id === 'team' && (
                <TeamMembersEditor
                  initialData={initialData?.about_page_team}
                  onSave={handleSave}
                />
              )}
              {selectedSection.id === 'credentials' && (
                <CredentialsEditor
                  initialData={initialData?.about_page_credentials}
                  onSave={handleSave}
                />
              )}
              {selectedSection.id === 'timeline' && (
                <TimelineEditor
                  initialData={initialData?.about_page_timeline}
                  onSave={handleSave}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-editors
function FounderStoryEditor({ initialData, onSave }: any) {
  const [data, setData] = useState(
    initialData || {
      title: 'The Story',
      content: 'In 2014, after working in global luxury hospitality, Bivatsu chose to return home to Bhutan, not to build a larger company, but a more meaningful one.',
      portraitImage: '',
    }
  );
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Founder Story
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The founder's journey and vision
          </p>
        </div>
        <button
          onClick={async () => {
            setSaving(true);
            await onSave(data);
            setSaving(false);
            toast.success('Story saved');
          }}
          disabled={saving}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Story Content
        </label>
        <textarea
          value={data.content}
          onChange={(e) => setData({ ...data, content: e.target.value })}
          rows={8}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
        />
      </div>

      <ImageInput
        value={data.portraitImage}
        onChange={(url) => setData({ ...data, portraitImage: url })}
        onRemove={() => setData({ ...data, portraitImage: '' })}
        label="Founder Portrait"
        folder="himalayanmarvel/about"
      />
    </div>
  );
}

function TeamMembersEditor({ initialData, onSave }: any) {
  const [team, setTeam] = useState(
    initialData?.members || [
      { id: '1', name: 'Bivatsu Giri', role: 'Founder', image: '', bio: '' },
    ]
  );
  const [saving, setSaving] = useState(false);

  const addMember = () => {
    setTeam([...team, { id: Date.now().toString(), name: '', role: '', image: '', bio: '' }]);
  };

  const removeMember = (id: string) => {
    setTeam(team.filter((m: any) => m.id !== id));
  };

  const updateMember = (id: string, field: string, value: string) => {
    setTeam(team.map((m: any) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Team Members
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Meet the team
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addMember}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
          <button
            onClick={async () => {
              setSaving(true);
              await onSave({ members: team });
              setSaving(false);
              toast.success('Team saved');
            }}
            disabled={saving}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 font-medium"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map((member: any, index: number) => (
          <div
            key={member.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Member {index + 1}
              </h4>
              <button
                onClick={() => removeMember(member.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <ImageInput
              value={member.image}
              onChange={(url) => updateMember(member.id, 'image', url)}
              onRemove={() => updateMember(member.id, 'image', '')}
              label="Photo"
              folder="himalayanmarvel/team"
            />

            <input
              type="text"
              value={member.name}
              onChange={(e) => updateMember(member.id, 'name', e.target.value)}
              className="w-full mt-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Name"
            />

            <input
              type="text"
              value={member.role}
              onChange={(e) => updateMember(member.id, 'role', e.target.value)}
              className="w-full mt-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Role"
            />

            <textarea
              value={member.bio}
              onChange={(e) => updateMember(member.id, 'bio', e.target.value)}
              rows={3}
              className="w-full mt-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
              placeholder="Short bio"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CredentialsEditor({ initialData, onSave }: any) {
  const [data, setData] = useState(
    initialData || {
      licenseNumber: '',
      certifications: [],
      memberships: [],
    }
  );
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Credentials
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Licenses and certifications
          </p>
        </div>
        <button
          onClick={async () => {
            setSaving(true);
            await onSave(data);
            setSaving(false);
            toast.success('Credentials saved');
          }}
          disabled={saving}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          License Number
        </label>
        <input
          type="text"
          value={data.licenseNumber}
          onChange={(e) => setData({ ...data, licenseNumber: e.target.value })}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          placeholder="Tour Operator License No."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Certifications (one per line)
        </label>
        <textarea
          value={data.certifications.join('\n')}
          onChange={(e) => setData({ ...data, certifications: e.target.value.split('\n').filter(Boolean) })}
          rows={4}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
          placeholder="Certified Bhutan Tour Operator&#10;Sustainable Tourism Member&#10;..."
        />
      </div>
    </div>
  );
}

function TimelineEditor({ initialData, onSave }: any) {
  const [milestones, setMilestones] = useState(
    initialData?.milestones || [
      { id: '1', year: '2014', title: 'Company Founded', description: 'Himalayan Marvels was established' },
    ]
  );
  const [saving, setSaving] = useState(false);

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now().toString(), year: '', title: '', description: '' }]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter((m: any) => m.id !== id));
  };

  const updateMilestone = (id: string, field: string, value: string) => {
    setMilestones(milestones.map((m: any) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Timeline
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Company milestones
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addMilestone}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </button>
          <button
            onClick={async () => {
              setSaving(true);
              await onSave({ milestones });
              setSaving(false);
              toast.success('Timeline saved');
            }}
            disabled={saving}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 font-medium"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone: any, index: number) => (
          <div
            key={milestone.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Milestone {index + 1}
              </h4>
              <button
                onClick={() => removeMilestone(milestone.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={milestone.year}
                onChange={(e) => updateMilestone(milestone.id, 'year', e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Year"
              />

              <input
                type="text"
                value={milestone.title}
                onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                className="md:col-span-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Title"
              />

              <textarea
                value={milestone.description}
                onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                rows={2}
                className="md:col-span-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                placeholder="Description"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
