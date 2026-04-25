'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: boolean;
}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'space-y-1.5',
          error && 'space-y-0',
          className
        )}
        {...props}
      />
    );
  }
);
FormItem.displayName = 'FormItem';

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  error?: boolean;
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, error, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-sm font-medium',
          error ? 'text-red-500' : 'text-gray-900/70',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

export const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('', className)} {...props} />;
});
FormControl.displayName = 'FormControl';

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-gray-900/50', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';
