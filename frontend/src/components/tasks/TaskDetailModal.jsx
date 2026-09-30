import { Pencil, Calendar, Clock, AlertTriangle, Tag, Activity } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  formatDate,
  formatDateTime,
  isOverdue,
  getPriorityColor,
  getStatusColor,
  getPriorityLabel,
  getStatusLabel,
} from '../../utils/helpers';

/**
 * Read-only detail view modal for a single task
 */
export function TaskDetailModal({ isOpen, onClose, task, onEdit }) {
  if (!task) return null;

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      maxWidth="max-w-lg"
      footer={
        <Button variant="primary" onClick={() => { onClose(); onEdit(task); }}>
          <Pencil size={15} />
          Edit Task
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 leading-snug">
            {task.title}
          </h2>
        </div>

        {/* Badges */}
        <div className="flex items-center flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
            <Tag size={11} />
            {getPriorityLabel(task.priority)} Priority
          </span>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
            <Activity size={11} />
            {getStatusLabel(task.status)}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700">
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        {/* Overdue warning */}
        {overdue && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              This task is overdue! It was due on {formatDate(task.dueDate)}.
            </p>
          </div>
        )}

        {/* Meta info */}
        <div className="grid grid-cols-1 gap-3">
          {task.dueDate && (
            <div className="flex items-center gap-3 text-sm">
              <div className={`flex items-center gap-2 flex-1 p-3 rounded-lg ${overdue ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400' : 'bg-gray-50 dark:bg-slate-900/50 text-gray-600 dark:text-slate-300'}`}>
                <Calendar size={15} className="flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wide font-medium">Due Date</p>
                  <p className="font-medium">{formatDate(task.dueDate)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-900/50">
              <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wide font-medium mb-1 flex items-center gap-1">
                <Clock size={11} /> Created
              </p>
              <p className="font-medium text-gray-700 dark:text-slate-300">
                {formatDateTime(task.createdAt)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-900/50">
              <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wide font-medium mb-1 flex items-center gap-1">
                <Clock size={11} /> Updated
              </p>
              <p className="font-medium text-gray-700 dark:text-slate-300">
                {formatDateTime(task.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
