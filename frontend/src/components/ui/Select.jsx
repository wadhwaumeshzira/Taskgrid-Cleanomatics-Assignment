/**
 * Reusable Select component with label, error, and options array
 */
export function Select({
  label,
  error,
  helperText,
  id,
  options = [],
  placeholder,
  className = '',
  required,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors duration-200 cursor-pointer
          bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:bg-gray-50 dark:disabled:bg-slate-800 disabled:cursor-not-allowed
          ${
            error
              ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
              : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
          }
          ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-gray-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
}
