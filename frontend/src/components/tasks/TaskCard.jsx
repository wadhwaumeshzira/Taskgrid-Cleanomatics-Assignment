import { Eye, Pencil, Trash2, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  formatDate,
  isOverdue,
  getPriorityLabel,
  getStatusLabel,
} from '../../utils/helpers';

const getCardGlow = (priority, isOverdue) => {
  if (isOverdue) return 'hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] dark:hover:shadow-[0_8px_30px_rgba(239,68,68,0.08)]';
  if (priority === 'high') return 'hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)] dark:hover:shadow-[0_8px_30px_rgba(239,68,68,0.06)]';
  if (priority === 'medium') return 'hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] dark:hover:shadow-[0_8px_30px_rgba(245,158,11,0.06)]';
  return 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] dark:hover:shadow-[0_8px_30px_rgba(16,185,129,0.06)]';
};

const getPriorityDot = (priority) => {
  if (priority === 'high') return 'bg-red-500 dark:bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  if (priority === 'medium') return 'bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
  return 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
};

const getStatusBadge = (status) => {
  if (status === 'completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
  if (status === 'in_progress') return 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
  return 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
};

export function TaskCard({ task, onView, onEdit, onDelete, index }) {
  const overdue = isOverdue(task.dueDate, task.status);
  const cardGlow = getCardGlow(task.priority, overdue);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative flex flex-col bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl rounded-[20px] border transition-all duration-300 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.02)]
        ${cardGlow}
        ${overdue
          ? 'border-red-200/60 dark:border-red-900/30'
          : 'border-gray-200/60 dark:border-white/5'
        }`}
      onClick={() => onView(task)}
    >
      {/* Subtle top gradient accent based on priority */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent rounded-t-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Top row: priority + status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`} />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 capitalize tracking-wide">
              {getPriorityLabel(task.priority)}
            </span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-medium border ${getStatusBadge(task.status)} tracking-wide`}>
            {getStatusLabel(task.status)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-[17px] leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 tracking-tight">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 -mt-1 font-normal">
            {task.description}
          </p>
        )}

        {/* Dates & Actions */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex flex-col gap-1.5">
            {task.dueDate && (
              <div className={`flex items-center gap-1.5 text-[11px] ${overdue ? 'text-red-500 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                {overdue ? <AlertTriangle size={12} strokeWidth={2.5} /> : <Calendar size={12} strokeWidth={2} />}
                <span className="tracking-wide uppercase">{overdue ? 'Overdue: ' : 'Due: '}</span>
                <span className="font-medium text-gray-600 dark:text-gray-300">{formatDate(task.dueDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 tracking-wide uppercase">
              <Clock size={12} strokeWidth={2} />
              <span>Created {formatDate(task.createdAt)}</span>
            </div>
          </div>

          {/* Action buttons — slide in on hover */}
          <div
            className="flex items-center gap-1 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onView(task)}
              className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
            >
              <Eye size={15} strokeWidth={2} />
            </button>
            <button
              onClick={() => onEdit(task)}
              className="p-2 rounded-lg text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
            >
              <Pencil size={15} strokeWidth={2} />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
