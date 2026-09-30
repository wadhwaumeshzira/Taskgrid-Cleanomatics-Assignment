import { Sun, Moon, CalendarDays, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * App Header with logo, dark mode toggle, and stats summary
 */
export function Header({ isDark, toggleTheme, stats }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full border-b border-gray-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            whileHover="hover"
            className="group flex items-center gap-3 cursor-pointer relative"
          >
            {/* Subtle glow behind logo */}
            <div className="absolute -inset-2 bg-indigo-500/0 group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20 blur-lg rounded-full transition-colors duration-500" />
            
            <motion.div 
              variants={{ hover: { scale: 1.05, rotate: -2 } }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative flex items-center justify-center w-8 h-8 rounded-[10px] bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 shadow-md shadow-indigo-500/20 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-shadow duration-300 overflow-hidden"
            >
              {/* Inner glass highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
              <div className="absolute inset-0 rounded-[10px] ring-1 ring-white/20 inset-ring" />
              
              <CalendarDays size={16} className="text-white relative z-10" strokeWidth={2.5} />
            </motion.div>
            
            <div className="flex flex-col relative z-10">
              <span className="text-[18px] font-extrabold tracking-tight bg-gradient-to-br from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent leading-none">
                TaskGrid
              </span>
            </div>
          </motion.div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Stats summary */}
            {stats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <ListTodo size={13} className="text-indigo-500 dark:text-indigo-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {stats.total ?? 0}
                  </span>
                  <span>total</span>
                </div>
                <div className="w-px h-3 bg-gray-300 dark:bg-white/10" />
                <div className="flex items-center gap-1 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {stats.pending ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {stats.in_progress ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {stats.completed ?? 0}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-200 relative group"
              aria-label="Toggle dark mode"
            >
              <div className="absolute inset-0 rounded-xl bg-gray-100 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
