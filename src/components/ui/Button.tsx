import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-victoria-navy-900 text-white hover:bg-victoria-navy-800 focus:ring-victoria-navy-400/50 shadow-victoria hover:shadow-victoria-lg',
      secondary: 'bg-victoria-gold-500 text-victoria-navy-900 hover:bg-victoria-gold-400 focus:ring-victoria-gold-400/50 shadow-victoria hover:shadow-gold-glow',
      outline: 'border-2 border-victoria-navy-800/80 text-victoria-navy-900 bg-transparent hover:bg-victoria-navy-900 hover:text-white hover:border-victoria-navy-900 focus:ring-victoria-navy-400/50',
      ghost: 'text-victoria-navy-700 hover:bg-victoria-navy-100/80 focus:ring-victoria-navy-400/30',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400/50',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-7 py-3.5 text-base rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
