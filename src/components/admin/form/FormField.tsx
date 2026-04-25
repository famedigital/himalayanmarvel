'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './Form';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldWrapperProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  className?: string;
  inputClassName?: string;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
}

export function FormFieldWrapper({
  name,
  label,
  description,
  placeholder,
  type = 'text',
  options,
  className,
  inputClassName,
  required,
  register,
  ...props
}: FormFieldWrapperProps) {
  const renderInput = () => {
    const baseClassName = cn(
      'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all',
      type === 'textarea' && 'resize-none',
      inputClassName
    );

    if (type === 'textarea') {
      return (
        <textarea
          placeholder={placeholder}
          className={baseClassName}
          {...register?.(name)}
        />
      );
    }

    if (type === 'select') {
      return (
        <div className="relative">
          <select
            className={cn(
              baseClassName,
              'appearance-none cursor-pointer'
            )}
            {...register?.(name)}
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value} className="bg-white">
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900/30 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      );
    }

    return (
      <input
        type={type}
        placeholder={placeholder}
        className={baseClassName}
        {...register?.(name)}
      />
    );
  };

  return (
    <FormItem className={className}>
      {label && (
        <FormLabel>
          {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
      )}
      <FormControl>
        {renderInput()}
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
