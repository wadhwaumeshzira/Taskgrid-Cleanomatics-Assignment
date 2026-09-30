import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component
 * Variants: primary, secondary, danger, ghost
 * Sizes: sm, md, lg
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 focus:ring-gray-900/50 dark:focus:ring-white/50 shadow-sm border border-transparent',
    secondary:
      'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-200/80 focus:ring-gray-200 shadow-sm dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-200 dark:border-white/10',
    danger:
      'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white focus:ring-red-500/50 shadow-sm border border-transparent',
    ghost:
      'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-600 focus:ring-gray-200 dark:hover:bg-white/5 dark:active:bg-white/10 dark:text-gray-400 dark:hover:text-gray-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
