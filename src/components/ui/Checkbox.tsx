import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                'w-5 h-5 rounded-md border-2 transition-all duration-200',
                'peer-focus:ring-2 peer-focus:ring-victoria-navy-400/40 peer-focus:ring-offset-2',
                'peer-checked:bg-victoria-navy-900 peer-checked:border-victoria-navy-900',
                error
                  ? 'border-red-400'
                  : 'border-victoria-slate-300 group-hover:border-victoria-slate-400',
                className
              )}
            />
            <Check
              className={cn(
                'absolute top-0.5 left-0.5 w-4 h-4 text-white transition-opacity duration-200',
                'opacity-0 peer-checked:opacity-100'
              )}
              strokeWidth={3}
            />
          </div>
          {label && (
            <span className="text-sm text-victoria-slate-700 select-none">
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
