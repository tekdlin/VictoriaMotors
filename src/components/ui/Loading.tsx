import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-victoria-slate-200 border-t-victoria-navy-800',
        sizes[size],
        className
      )}
    />
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <Spinner size="lg" />
      <p className="mt-4 text-victoria-slate-600">{message}</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Spinner size="lg" />
        <p className="mt-4 text-victoria-navy-700 font-medium">Loading...</p>
      </div>
    </div>
  );
}
