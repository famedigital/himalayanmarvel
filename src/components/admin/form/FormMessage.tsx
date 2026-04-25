'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const formMessageVariants = cva(
  'flex items-center gap-1.5 text-sm',
  {
    variants: {
      variant: {
        error: 'text-red-500',
        success: 'text-green-500',
        info: 'text-blue-500',
      },
    },
    defaultVariants: {
      variant: 'error',
    },
  }
);

interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof formMessageVariants> {
  message?: string;
}

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, variant, message, children, ...props }, ref) => {
  const body = message || children;

  if (!body) {
    return null;
  }

  const Icon = {
    error: AlertCircle,
    success: CheckCircle2,
    info: Info,
  }[variant || 'error'];

  return (
    <p
      ref={ref}
      className={cn(formMessageVariants({ variant }), className)}
      {...props}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{body}</span>
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

// Convenience component for error messages
export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string | { message?: string };
}

export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, error, ...props }, ref) => {
    const message = typeof error === 'string' ? error : error?.message;

    if (!message) {
      return null;
    }

    return (
      <p
        ref={ref}
        className={cn('flex items-center gap-1.5 text-sm text-red-500 mt-1', className)}
        {...props}
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
      </p>
    );
  }
);
FormError.displayName = 'FormError';

// Convenience component for help text
export const FormHelp = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-gray-900/50 mt-1', className)}
      {...props}
    />
  );
});
FormHelp.displayName = 'FormHelp';
