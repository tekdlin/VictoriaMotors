import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, onClose, ...props }, ref) => {
    const variants = {
      info: {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: Info,
        iconColor: 'text-blue-500',
      },
      success: {
        container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        icon: CheckCircle,
        iconColor: 'text-emerald-500',
      },
      warning: {
        container: 'bg-amber-50 border-amber-200 text-amber-800',
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
      },
      error: {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: AlertCircle,
        iconColor: 'text-red-500',
      },
    };

    const { container, icon: Icon, iconColor } = variants[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex gap-3 p-4 rounded-lg border',
          container,
          className
        )}
        {...props}
      >
        <Icon className={cn('h-5 w-5 flex-shrink-0', iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
