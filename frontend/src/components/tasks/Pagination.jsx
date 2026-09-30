import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination component with page numbers, prev/next, and showing X-Y of Z text
 */
export function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (totalPages <= 1 && total <= limit) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Generate page numbers to show (up to 5 with ellipsis)
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const btnBase =
    'inline-flex items-center justify-center w-8 h-8 text-sm rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      {/* Showing X-Y of Z */}
      <p className="text-sm text-gray-500 dark:text-slate-400">
        Showing{' '}
        <span className="font-semibold text-gray-700 dark:text-slate-200">{start}</span>–
        <span className="font-semibold text-gray-700 dark:text-slate-200">{end}</span> of{' '}
        <span className="font-semibold text-gray-700 dark:text-slate-200">{total}</span> tasks
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`${btnBase} disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700`}
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((p, idx) =>
          p === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`${btnBase} ${
                p === page
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`${btnBase} disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
