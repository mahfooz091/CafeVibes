import { cn } from '../../utils/helpers';

const Button = ({
  children, variant = 'primary', size = 'md', className, loading, disabled, ...props
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'inline-flex items-center justify-center gap-2 whitespace-nowrap px-6 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all shrink-0',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: '',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={cn('shrink-0', variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
