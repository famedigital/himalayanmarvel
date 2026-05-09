'use client';

import { useState } from 'react';
import {
  ImageIcon,
  User,
  Shield,
  Star,
  Map,
  Grid3X3,
  Film,
  HelpCircle,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FAQEditor from './FAQEditor';
import FounderHeroEditor from './FounderHeroEditor';
import TrustArchitectureEditor from './TrustArchitectureEditor';
import GoogleReviewsEditor from './GoogleReviewsEditor';
import JourneyCardsEditor from './JourneyCardsEditor';
import CinematicScrollEditor from './CinematicScrollEditor';
import ConciergeInquiryEditor from './ConciergeInquiryEditor';
import BentoEditor from './BentoEditor';
import PlaceholderEditor from './PlaceholderEditor';

interface Section {
  id: string;
  name: string;
  icon: any;
  description: string;
  contentKey: string;
  editor: string;
}

const HOMEPAGE_SECTIONS: Section[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    icon: ImageIcon,
    description: 'Main hero with video/image background',
    contentKey: 'homepage_hero',
    editor: 'placeholder',
  },
  {
    id: 'founder',
    name: 'Founder Hero',
    icon: User,
    description: 'Founder credentials and story',
    contentKey: 'homepage_founder',
    editor: 'founder',
  },
  {
    id: 'trust',
    name: 'Trust Architecture',
    icon: Shield,
    description: 'Licenses, partnerships, badges',
    contentKey: 'homepage_trust',
    editor: 'trust',
  },
  {
    id: 'reviews',
    name: 'Google Reviews',
    icon: Star,
    description: 'Google reviews and ratings',
    contentKey: 'homepage_reviews',
    editor: 'google-reviews',
  },
  {
    id: 'bento',
    name: 'Bento Grid',
    icon: Grid3X3,
    description: 'Tour categories bento grid',
    contentKey: 'homepage_bento',
    editor: 'bento',
  },
  {
    id: 'tour-category',
    name: 'Tour Category',
    icon: Map,
    description: 'Tour category showcase',
    contentKey: 'homepage_journeys',
    editor: 'journeys',
  },
  {
    id: 'cinematic',
    name: 'Cinematic Scroll',
    icon: Film,
    description: 'Scroll-based storytelling',
    contentKey: 'homepage_cinematic',
    editor: 'cinematic',
  },
  {
    id: 'faq',
    name: 'FAQ',
    icon: HelpCircle,
    description: 'Frequently asked questions',
    contentKey: 'homepage_faq',
    editor: 'faq',
  },
  {
    id: 'concierge-form',
    name: 'Concierge Form',
    icon: Mail,
    description: 'Contact inquiry form',
    contentKey: 'homepage_concierge_form',
    editor: 'concierge',
  },
];

interface HomepageEditorProps {
  initialData: Record<string, any>;
  onSave: (key: string, value: any) => void;
}

export default function HomepageEditor({
  initialData,
  onSave,
}: HomepageEditorProps) {
  const [selectedSection, setSelectedSection] = useState(HOMEPAGE_SECTIONS[0]);
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());

  const handleSectionChange = (section: Section) => {
    if (unsavedChanges.has(selectedSection.id)) {
      const confirm = window.confirm(
        'You have unsaved changes. Save before switching?'
      );
      if (!confirm) return;
    }
    setSelectedSection(section);
  };

  const handleSave = async (data: any) => {
    await onSave(selectedSection.contentKey, data);
    setUnsavedChanges((prev) => {
      const next = new Set(prev);
      next.delete(selectedSection.id);
      return next;
    });
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px] lg:h-[calc(100vh-200px)]">
        {/* Left Panel - Hidden on Mobile */}
        <div className="hidden lg:block lg:col-span-1 border-r border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-b from-gray-50/50 to-gray-100/50 dark:from-gray-950/50 dark:to-gray-900/50">
          <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 px-2">
                Sections
              </h3>
              {HOMEPAGE_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = selectedSection.id === section.id;
                const hasUnsaved = unsavedChanges.has(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section)}
                    className={cn(
                      'w-full text-left p-3 rounded-xl transition-all duration-200',
                      'hover:scale-[1.01] active:scale-[0.99]',
                      'flex items-start gap-3 group',
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                        : 'hover:bg-white dark:hover:bg-gray-800'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 mt-0.5 transition-colors',
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-amber-500'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{section.name}</div>
                      <div
                        className={cn(
                          'text-xs mt-0.5 line-clamp-1',
                          isActive ? 'text-amber-100' : 'text-gray-500'
                        )}
                      >
                        {section.description}
                      </div>
                      {hasUnsaved && (
                        <div className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <span className="w-1 h-1 bg-current rounded-full animate-pulse" />
                          Unsaved
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
              const section = HOMEPAGE_SECTIONS.find(s => s.id === e.target.value);
              if (section) handleSectionChange(section);
            }}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {HOMEPAGE_SECTIONS.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Panel */}
        <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Section Header */}
            <div className="mb-3 lg:mb-5 flex items-center justify-between pb-3 lg:pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 lg:gap-3">
                {selectedSection.id === 'hero' && (
                  <ImageIcon className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                )}
                {selectedSection.id === 'founder' && (
                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                )}
                {selectedSection.id === 'trust' && (
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                )}
                {selectedSection.id === 'reviews' && (
                  <Star className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                )}
                {selectedSection.id === 'bento' && (
                  <Grid3X3 className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                )}
                {selectedSection.id === 'tour-category' && (
                  <Map className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                )}
                {selectedSection.id === 'journeys' && (
                  <Map className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                )}
                {selectedSection.id === 'cinematic' && (
                  <Film className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                )}
                {selectedSection.id === 'faq' && (
                  <HelpCircle className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                )}
                {selectedSection.id === 'concierge-form' && (
                  <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                )}
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {selectedSection.name}
                  </h2>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {selectedSection.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Editor */}
            {selectedSection.editor === 'faq' && (
              <FAQEditor
                initialData={initialData[selectedSection.contentKey]}
                onSave={handleSave}
              />
            )}
            {selectedSection.editor === 'founder' && (
              <FounderHeroEditor
                initialData={initialData[selectedSection.contentKey]}
                onSave={handleSave}
              />
            )}
            {selectedSection.editor === 'trust' && (
              <TrustArchitectureEditor
                initialData={initialData[selectedSection.contentKey]}
                onSave={handleSave}
              />
            )}
            {selectedSection.editor === 'google-reviews' && (
              <GoogleReviewsEditor
                initialData={initialData[selectedSection.contentKey]}
                onSave={handleSave}
              />
            )}
            {selectedSection.editor === 'bento' && (
              <BentoEditor
                initialData={initialData[selectedSection.contentKey]}
                onSave={handleSave}
              />
            )}
            {selectedSection.editor === 'journeys' && (
              <JourneyCardsEditor
                initialData={initialData[selectedSection.contentKey]}
                onSave={handleSave}
              />
            )}
            {selectedSection.editor === 'cinematic' && (
              <CinematicScrollEditor
                initialData={initialData[selectedSection.contentKey]}
                onSave={handleSave}
              />
            )}
            {selectedSection.editor === 'concierge' && (
              <ConciergeInquiryEditor
                initialData={initialData[selectedSection.contentKey]}
                onSave={handleSave}
              />
            )}
            {selectedSection.editor === 'placeholder' && (
              <PlaceholderEditor
                initialData={initialData[selectedSection.contentKey]}
                onSave={handleSave}
                sectionName={selectedSection.name}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
