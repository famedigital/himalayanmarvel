'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  loading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn('gap-2', className)}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? loadingText : children}
    </Button>
  );
}
