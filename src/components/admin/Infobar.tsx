'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
  AlertTriangle,
} from 'lucide-react';

const infobarVariants = cva(
  'relative flex items-start gap-3 rounded-xl border p-4 transition-all',
  {
    variants: {
      variant: {
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        success: 'bg-green-50 border-green-200 text-green-900',
        warning: 'bg-orange-50 border-orange-200 text-orange-900',
        error: 'bg-red-50 border-red-200 text-red-900',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

interface InfobarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof infobarVariants> {
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const Infobar = React.forwardRef<HTMLDivElement, InfobarProps>(
  (
    {
      className,
      variant = 'info',
      title,
      dismissible = false,
      onDismiss,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(true);

    const handleDismiss = () => {
      setVisible(false);
      onDismiss?.();
    };

    if (!visible) {
      return null;
    }

    const defaultIcon = {
      info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
      success: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
      warning: <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />,
      error: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    }[variant || 'info'];

    return (
      <div
        ref={ref}
        className={cn(infobarVariants({ variant }), className)}
        {...props}
      >
        {icon || defaultIcon}
        <div className="flex-1 space-y-1">
          {title && (
            <p className="font-semibold text-sm">{title}</p>
          )}
          <div className="text-sm leading-relaxed">
            {children}
          </div>
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 opacity-60" />
          </button>
        )}
      </div>
    );
  }
);
Infobar.displayName = 'Infobar';

// Pre-configured variants for convenience
export const InfoBar = (props: Omit<InfobarProps, 'variant'>) => (
  <Infobar {...props} variant="info" />
);

export const SuccessBar = (props: Omit<InfobarProps, 'variant'>) => (
  <Infobar {...props} variant="success" />
);

export const WarningBar = (props: Omit<InfobarProps, 'variant'>) => (
  <Infobar {...props} variant="warning" />
);

export const ErrorBar = (props: Omit<InfobarProps, 'variant'>) => (
  <Infobar {...props} variant="error" />
);

// Hook for managing infobar state
export function useInfobar() {
  const [visible, setVisible] = React.useState(true);

  return {
    visible,
    show: () => setVisible(true),
    hide: () => setVisible(false),
    toggle: () => setVisible((prev) => !prev),
  };
}

export default Infobar;
