import { Button } from './Button';
import { motion } from 'framer-motion';

/**
 * Empty state component with icon, title, description, and optional action
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-3xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]"
    >
      {Icon && (
        <motion.div 
          animate={{ y: [0, -6, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-5 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm"
        >
          <Icon size={36} className="text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
        </motion.div>
      )}
      <h3 className="text-[17px] font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={onAction} variant="primary" className="shadow-sm">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
