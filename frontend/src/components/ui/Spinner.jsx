/**
 * Loading spinner with size variants
 * Sizes: sm, md, lg, xl
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${
        sizes[size] || sizes.md
      } ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

/**
 * Full-page or container centered spinner
 */
export function SpinnerOverlay({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
