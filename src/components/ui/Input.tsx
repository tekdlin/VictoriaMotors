import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, type = 'text', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-victoria-navy-800 mb-1.5 tracking-tight"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border bg-white text-victoria-navy-900 placeholder:text-victoria-slate-400',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-victoria-navy-400/40 focus:border-victoria-navy-400',
            error
              ? 'border-red-400 focus:ring-red-400/40'
              : 'border-victoria-slate-200 hover:border-victoria-slate-300',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1.5 text-sm text-victoria-slate-500">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
