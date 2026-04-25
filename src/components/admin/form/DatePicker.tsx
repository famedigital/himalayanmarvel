'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className,
  disabled,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    typeof value === 'string' ? (value ? new Date(value) : undefined) : value
  );

  // Update internal date when prop changes
  React.useEffect(() => {
    setInternalDate(
      typeof value === 'string' ? (value ? new Date(value) : undefined) : value
    );
  }, [value]);

  const handleDateChange = (date: Date | undefined) => {
    setInternalDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!input) {
      handleDateChange(undefined);
      return;
    }

    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) {
      handleDateChange(parsed);
    }
  };

  // Simple calendar implementation
  const renderCalendar = () => {
    const currentDate = internalDate || new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = internalDate && (
        date.getDate() === internalDate.getDate() &&
        date.getMonth() === internalDate.getMonth() &&
        date.getFullYear() === internalDate.getFullYear()
      );

      const isDisabled = (
        (minDate && date < minDate) ||
        (maxDate && date > maxDate)
      );

      days.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={() => handleDateChange(date)}
          className={cn(
            'p-2 rounded-lg text-sm transition-colors',
            isSelected
              ? 'bg-orange-500 text-white font-semibold'
              : 'hover:bg-gray-100 text-gray-900',
            isDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent'
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentDate = internalDate || new Date();

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all text-left',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <CalendarIcon className="w-5 h-5 text-gray-900/30 flex-shrink-0" />
        <span className="flex-1">
          {internalDate
            ? currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : placeholder}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 top-full mt-2 left-0 w-auto p-4 bg-white rounded-xl shadow-xl border border-gray-200">
            <div className="space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    handleDateChange(newDate);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="font-semibold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    handleDateChange(newDate);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="p-2 text-xs font-medium text-gray-900/50"
                  >
                    {day}
                  </div>
                ))}
                {/* Days */}
                {renderCalendar()}
              </div>

              {/* Today button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDateChange(new Date());
                }}
                className="w-full py-2 text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DatePicker;
