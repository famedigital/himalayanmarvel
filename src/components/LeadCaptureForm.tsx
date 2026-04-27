'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Calendar, Users, Globe, DollarSign, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import DatePicker from '@/components/ui/DatePicker';
import { leadSchema, type LeadFormData, BUDGET_OPTIONS, TRIP_TYPE_OPTIONS, COUNTRY_OPTIONS } from '@/lib/forms/lead-validation';

interface LeadCaptureFormProps {
  className?: string;
  onSuccess?: () => void;
}

/**
 * Lead Capture Form Component
 * High-conversion form for capturing Bhutan tour inquiries
 * Features:
 * - Glass morphism design
 * - Form validation with Zod
 * - Urgency elements
 * - Dark mode support
 * - Responsive layout
 */
export default function LeadCaptureForm({ className = '', onSuccess }: LeadCaptureFormProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    country: '',
    travelDates: {
      from: undefined as unknown as Date,
      to: undefined as unknown as Date,
    },
    budget: '',
    tripType: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  // Validate single field
  const validateField = (name: keyof LeadFormData, value: any) => {
    try {
      leadSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, [name]: error.errors[0]?.message }));
      return false;
    }
  };

  // Handle input change
  const handleInputChange = (name: keyof LeadFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Handle date range change
  const handleDateChange = (value: { from: Date; to: Date }) => {
    setFormData((prev) => ({ ...prev, travelDates: value }));
    validateField('travelDates', value);
  };

  // Validate entire form
  const validateForm = (): boolean => {
    try {
      leadSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
      error.errors.forEach((err: any) => {
        const path = err.path.join('.') as keyof LeadFormData;
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitError('Please fix the errors above');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitSuccess(true);
      if (onSuccess) onSuccess();

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          country: '',
          travelDates: {
            from: undefined as unknown as Date,
            to: undefined as unknown as Date,
          },
          budget: '',
          tripType: '',
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mobile collapsed state
  if (isCollapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`md:hidden ${className}`}
      >
        <motion.button
          onClick={() => setIsCollapsed(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-full text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-3 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #006838 0%, #008c4d 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
          }}
        >
          <span>Plan Your Bhutan Trip</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Desktop: Always visible, Mobile: Collapsible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl overflow-hidden relative"
        style={{
          backgroundColor: isDark ? 'rgba(20, 28, 20, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.1)'}`,
          boxShadow: isDark
            ? '0 24px 64px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(247, 247, 242, 0.03)'
            : '0 24px 64px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        }}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setIsCollapsed(true)}
          className="md:hidden absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
          style={{ backgroundColor: isDark ? 'rgba(28, 36, 28, 0.8)' : 'rgba(247, 247, 242, 0.8)' }}
        >
          <X className="w-5 h-5" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }} />
        </button>

        <div className="p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="mb-6">
            <h3
              className="text-2xl md:text-3xl font-light mb-2"
              style={{
                color: isDark ? '#F7F7F2' : '#1A1A1A',
                fontFamily: 'var(--font-playfair)',
              }}
            >
              Get Your Free{' '}
              <span className="italic" style={{ color: '#D4AF37' }}>
                Bhutan Travel Plan
              </span>
            </h3>
            <p className="text-sm" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
              Custom itinerary within 24 hours • No commitment required
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 p-4 rounded-xl flex items-center gap-3"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 104, 56, 0.2)' : 'rgba(0, 104, 56, 0.1)',
                  border: `1px solid ${isDark ? 'rgba(0, 104, 56, 0.3)' : 'rgba(0, 104, 56, 0.2)'}`,
                }}
              >
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#006838' }} />
                <div>
                  <p className="font-medium" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                    Thank you! We'll respond within 24 hours.
                  </p>
                  <p className="text-sm" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
                    Check your email for confirmation.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl"
                style={{
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
                }}
              >
                <p className="text-sm" style={{ color: '#EF4444' }}>
                  {submitError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-[0.15em] uppercase block" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-transparent outline-none text-sm py-2.5 px-4 rounded-lg border transition-all"
                  style={{
                    color: isDark ? '#F7F7F2' : '#1A1A1A',
                    borderColor: errors.name
                      ? '#EF4444'
                      : isDark
                      ? 'rgba(212, 175, 55, 0.15)'
                      : 'rgba(0, 104, 56, 0.15)',
                    backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.5)',
                  }}
                  onFocus={(e) => {
                    if (!errors.name) {
                      (e.target as HTMLInputElement).style.borderColor = '#D4AF37';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.name) {
                      (e.target as HTMLInputElement).style.borderColor = isDark
                        ? 'rgba(212, 175, 55, 0.15)'
                        : 'rgba(0, 104, 56, 0.15)';
                    }
                  }}
                />
                {errors.name && <p className="text-xs" style={{ color: '#EF4444' }}>{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-[0.15em] uppercase block" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-transparent outline-none text-sm py-2.5 px-4 rounded-lg border transition-all"
                  style={{
                    color: isDark ? '#F7F7F2' : '#1A1A1A',
                    borderColor: errors.email
                      ? '#EF4444'
                      : isDark
                      ? 'rgba(212, 175, 55, 0.15)'
                      : 'rgba(0, 104, 56, 0.15)',
                    backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.5)',
                  }}
                  onFocus={(e) => {
                    if (!errors.email) {
                      (e.target as HTMLInputElement).style.borderColor = '#D4AF37';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.email) {
                      (e.target as HTMLInputElement).style.borderColor = isDark
                        ? 'rgba(212, 175, 55, 0.15)'
                        : 'rgba(0, 104, 56, 0.15)';
                    }
                  }}
                />
                {errors.email && <p className="text-xs" style={{ color: '#EF4444' }}>{errors.email}</p>}
              </div>
            </div>

            {/* Country & Trip Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-[0.15em] uppercase flex items-center gap-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
                  <Globe className="w-3 h-3" />
                  Country *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full bg-transparent outline-none text-sm py-2.5 px-4 rounded-lg border transition-all appearance-none cursor-pointer"
                  style={{
                    color: isDark ? '#F7F7F2' : '#1A1A1A',
                    borderColor: errors.country
                      ? '#EF4444'
                      : isDark
                      ? 'rgba(212, 175, 55, 0.15)'
                      : 'rgba(0, 104, 56, 0.15)',
                    backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.5)',
                  }}
                  onFocus={(e) => {
                    if (!errors.country) {
                      (e.target as HTMLSelectElement).style.borderColor = '#D4AF37';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.country) {
                      (e.target as HTMLSelectElement).style.borderColor = isDark
                        ? 'rgba(212, 175, 55, 0.15)'
                        : 'rgba(0, 104, 56, 0.15)';
                    }
                  }}
                >
                  <option value="">Select your country</option>
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-xs" style={{ color: '#EF4444' }}>{errors.country}</p>}
              </div>

              {/* Trip Type Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-[0.15em] uppercase flex items-center gap-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
                  <Users className="w-3 h-3" />
                  Trip Type *
                </label>
                <select
                  value={formData.tripType}
                  onChange={(e) => handleInputChange('tripType', e.target.value)}
                  className="w-full bg-transparent outline-none text-sm py-2.5 px-4 rounded-lg border transition-all appearance-none cursor-pointer"
                  style={{
                    color: isDark ? '#F7F7F2' : '#1A1A1A',
                    borderColor: errors.tripType
                      ? '#EF4444'
                      : isDark
                      ? 'rgba(212, 175, 55, 0.15)'
                      : 'rgba(0, 104, 56, 0.15)',
                    backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.5)',
                  }}
                  onFocus={(e) => {
                    if (!errors.tripType) {
                      (e.target as HTMLSelectElement).style.borderColor = '#D4AF37';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.tripType) {
                      (e.target as HTMLSelectElement).style.borderColor = isDark
                        ? 'rgba(212, 175, 55, 0.15)'
                        : 'rgba(0, 104, 56, 0.15)';
                    }
                  }}
                >
                  <option value="">What interests you?</option>
                  {TRIP_TYPE_OPTIONS.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.tripType && <p className="text-xs" style={{ color: '#EF4444' }}>{errors.tripType}</p>}
              </div>
            </div>

            {/* Travel Dates Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-[0.15em] uppercase flex items-center gap-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
                <Calendar className="w-3 h-3" />
                Travel Dates *
              </label>
              <DatePicker
                value={formData.travelDates.from ? formData.travelDates : undefined}
                onChange={handleDateChange}
                placeholder="Select your travel dates"
                error={errors.travelDates as string}
              />
            </div>

            {/* Budget Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-[0.15em] uppercase flex items-center gap-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
                <DollarSign className="w-3 h-3" />
                Budget Range *
              </label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full bg-transparent outline-none text-sm py-2.5 px-4 rounded-lg border transition-all appearance-none cursor-pointer"
                style={{
                  color: isDark ? '#F7F7F2' : '#1A1A1A',
                  borderColor: errors.budget
                    ? '#EF4444'
                    : isDark
                    ? 'rgba(212, 175, 55, 0.15)'
                    : 'rgba(0, 104, 56, 0.15)',
                  backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.5)',
                }}
                onFocus={(e) => {
                  if (!errors.budget) {
                    (e.target as HTMLSelectElement).style.borderColor = '#D4AF37';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.budget) {
                    (e.target as HTMLSelectElement).style.borderColor = isDark
                      ? 'rgba(212, 175, 55, 0.15)'
                      : 'rgba(0, 104, 56, 0.15)';
                  }
                }}
              >
                <option value="">Select your budget</option>
                {BUDGET_OPTIONS.map((budget) => (
                  <option key={budget.value} value={budget.value}>
                    {budget.label}
                  </option>
                ))}
              </select>
              {errors.budget && <p className="text-xs" style={{ color: '#EF4444' }}>{errors.budget}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              whileHover={{ scale: isSubmitting || submitSuccess ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting || submitSuccess ? 1 : 0.99 }}
              className="w-full py-4 rounded-full text-white text-sm font-semibold tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all relative overflow-hidden"
              style={{
                background: isSubmitting || submitSuccess
                  ? 'rgba(0, 104, 56, 0.5)'
                  : 'linear-gradient(135deg, #006838 0%, #008c4d 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                cursor: isSubmitting || submitSuccess ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || submitSuccess ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : submitSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Request Sent!</span>
                </>
              ) : (
                <>
                  <span>Get Free Itinerary in 24 Hours</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Footer Info */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#006838', boxShadow: '0 0 8px rgba(0, 104, 56, 0.5)' }} />
                <span className="text-xs" style={{ color: isDark ? 'rgba(247, 247, 242, 0.35)' : 'rgba(26, 26, 26, 0.35)' }}>
                  Responds in 4 hours
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: isDark ? 'rgba(247, 247, 242, 0.35)' : 'rgba(26, 26, 26, 0.35)' }}>
                  Limited spots for peak season
                </span>
              </div>
            </div>

            {/* Privacy Note */}
            <p className="text-center text-xs mt-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.25)' : 'rgba(26, 26, 26, 0.25)' }}>
              Your information is held in strict confidence • No spam, ever
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
