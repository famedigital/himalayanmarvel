'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';

interface DatePickerProps {
  value?: { from: Date; to: Date };
  onChange: (value: { from: Date; to: Date }) => void;
  minDate?: Date;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

/**
 * Date Range Picker Component
 * Selects a range of dates for travel planning
 * Includes minimum date validation and dark mode support
 */
export default function DatePicker({
  value,
  onChange,
  minDate,
  placeholder = 'Select travel dates',
  error,
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  // Calculate minimum date (default: 7 days from now)
  const minimumDate = minDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Check if a date is in the selected range
  const isDateInRange = (date: Date) => {
    if (!value?.from || !value?.to) return false;
    return date >= value.from && date <= value.to;
  };

  // Check if a date is the start or end of range
  const isDateSelected = (date: Date) => {
    return value?.from && date.getTime() === value.from.getTime();
  };

  const isDateEnd = (date: Date) => {
    return value?.to && date.getTime() === value.to.getTime();
  };

  // Check if date is before minimum date
  const isDateDisabled = (date: Date) => {
    return date < minimumDate;
  };

  // Check if date is in hover range
  const isDateInHoverRange = (date: Date) => {
    if (!value?.from || !hoveredDate) return false;
    if (value.to) return false;
    return date >= value.from && date <= hoveredDate;
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!value?.from || (value.from && value.to)) {
      // Start new range
      onChange({ from: date, to: date });
    } else if (date < value.from) {
      // Clicked before start date
      onChange({ from: date, to: value.from });
    } else {
      // Complete range
      onChange({ from: value.from, to: date });
    }
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Format date range for display
  const formatDisplay = () => {
    if (!value?.from) return placeholder;
    if (!value?.to) {
      return value.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return `${value.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${value.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
        disabled={disabled}
        className="w-full text-left py-3 px-4 rounded-lg border transition-all flex items-center justify-between gap-3"
        style={{
          borderColor: error ? '#EF4444' : isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.1)',
          backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.5)',
          color: isDark ? '#F7F7F2' : '#1A1A1A',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onFocus={(e) => {
          if (!disabled && !error) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4AF37';
          }
        }}
        onBlur={(e) => {
          if (!disabled && !error) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.1)';
          }
        }}
      >
        <span className="text-sm md:text-base">{formatDisplay()}</span>
        <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
      </motion.button>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs mt-1"
            style={{ color: '#EF4444' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 mt-2 rounded-xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: isDark ? '#1C241C' : '#FFFFFF',
              border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.1)'}`,
            }}
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.1)' }}>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg transition-colors"
                style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <span className="font-semibold" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToNextMonth}
                className="p-2 rounded-lg transition-colors"
                style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 px-4 pt-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-xs font-semibold py-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.4)' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 px-4 pb-4">
              {days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="h-10" />;
                }

                const isSelected = isDateSelected(date);
                const isEnd = isDateEnd(date);
                const inRange = isDateInRange(date);
                const inHoverRange = isDateInHoverRange(date);
                const disabled = isDateDisabled(date);

                return (
                  <motion.button
                    key={index}
                    type="button"
                    whileHover={{ scale: disabled ? 1 : 1.05 }}
                    whileTap={{ scale: disabled ? 1 : 0.95 }}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => setHoveredDate(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    disabled={disabled}
                    className="h-10 rounded-lg text-sm font-medium transition-all relative"
                    style={{
                      backgroundColor: isSelected
                        ? '#006838'
                        : isEnd
                        ? '#006838'
                        : inRange
                        ? 'rgba(0, 104, 56, 0.2)'
                        : inHoverRange
                        ? 'rgba(0, 104, 56, 0.1)'
                        : 'transparent',
                      color: isSelected || isEnd
                        ? '#FFFFFF'
                        : disabled
                        ? isDark
                          ? 'rgba(247, 247, 242, 0.2)'
                          : 'rgba(26, 26, 26, 0.2)'
                        : isDark
                        ? '#F7F7F2'
                        : '#1A1A1A',
                      opacity: disabled ? 0.3 : 1,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      border: inRange && !isSelected && !isEnd ? '1px solid rgba(0, 104, 56, 0.1)' : 'none',
                    }}
                  >
                    {date.getDate()}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer Info */}
            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.1)' }}>
              <p className="text-xs text-center" style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.4)' }}>
                Minimum 7 days advance booking required
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
