import { Search, ChevronUp, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

function FilterSelect({ value, onChange, options }) {
  const hasValue = value !== '';
  return (
    <div className="relative group flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none pl-4 pr-9 py-2 text-[13px] font-medium rounded-[10px] border border-transparent bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer ${
          hasValue ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' : 'text-gray-600 dark:text-gray-300'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:bg-[#111] text-gray-900 dark:text-gray-200">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:text-gray-800 dark:group-hover:text-white ${
        hasValue ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'
      }`} />
    </div>
  );
}

export function TaskFilters({ filters, onFilterChange }) {
  const hasActiveFilters =
    filters.search || filters.status || filters.priority || filters.date || filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc';

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: '',
      priority: '',
      date: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 bg-white/70 dark:bg-[#0a0a0a]/60 rounded-[18px] border border-white/50 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl p-2 mb-4 group ring-1 ring-gray-900/5 dark:ring-white/5"
    >
      <div className="flex flex-col lg:flex-row gap-2">
        {/* Search Input (Primary) */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-gray-400 dark:text-gray-500 transition-colors duration-200 peer-focus:text-indigo-500 peer-focus:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
            />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="peer w-full pl-11 pr-10 py-3 text-[15px] font-medium rounded-[12px] border border-transparent bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/[0.04] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm shadow-black/5"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute inset-y-0 right-3 flex items-center p-1.5 my-auto h-fit rounded-[8px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters & Tools */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none px-1">
          
          <input
            type="date"
            value={filters.date || ''}
            onChange={(e) => onFilterChange({ date: e.target.value })}
            className={`appearance-none px-3 py-2 text-[13px] font-medium rounded-[10px] border border-transparent bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer flex-shrink-0 [color-scheme:light] dark:[color-scheme:dark] ${
              filters.date ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' : 'text-gray-600 dark:text-gray-300'
            }`}
            title="Filter by Due Date"
          />

          <FilterSelect
            value={filters.status}
            onChange={(val) => onFilterChange({ status: val })}
            options={STATUS_OPTIONS}
          />
          <FilterSelect
            value={filters.priority}
            onChange={(val) => onFilterChange({ priority: val })}
            options={PRIORITY_OPTIONS}
          />
          <FilterSelect
            value={filters.sortBy}
            onChange={(val) => onFilterChange({ sortBy: val })}
            options={SORT_OPTIONS}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              onFilterChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
            }
            className="flex items-center justify-center w-9 h-9 rounded-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex-shrink-0 ml-1"
            title={filters.sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
          >
            {filters.sortOrder === 'asc' ? (
              <ChevronUp size={16} strokeWidth={2.5} />
            ) : (
              <ChevronDown size={16} strokeWidth={2.5} />
            )}
          </motion.button>

          {hasActiveFilters && (
            <motion.button 
              initial={{ opacity: 0, width: 0, marginLeft: 0 }}
              animate={{ opacity: 1, width: 'auto', marginLeft: 8 }}
              exit={{ opacity: 0, width: 0, marginLeft: 0 }}
              onClick={clearFilters} 
              className="flex items-center gap-1.5 px-3 py-2 h-9 text-[13px] font-semibold rounded-[10px] text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex-shrink-0 whitespace-nowrap"
            >
              Clear
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
