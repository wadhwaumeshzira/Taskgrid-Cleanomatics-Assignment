import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, ClipboardList, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskStats } from '../components/tasks/TaskStats';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { Pagination } from '../components/tasks/Pagination';
import { Button } from '../components/ui/Button';
import { SpinnerOverlay } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Modal } from '../components/ui/Modal';

export function Dashboard() {
  const {
    tasks,
    loading,
    error,
    stats,
    pagination,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
  } = useTasks();

  // Modal states
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    setSelectedTask(null);
    setTaskModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleOpenView = (task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const handleOpenDelete = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, formData);
        toast.success('Task updated successfully!');
      } else {
        await createTask(formData);
        toast.success('Task created successfully!');
      }
      setTaskModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteTask(taskToDelete.id);
      toast.success('Task deleted successfully!');
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    setFilters({ page: newPage });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-end justify-between relative"
      >
        <div className="relative z-10">
          {/* Subtle animated background glow behind title */}
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
          
          <h1 className="text-3xl sm:text-[34px] font-extrabold tracking-tight bg-gradient-to-br from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent pb-1">
            My Tasks
          </h1>
          <p className="text-[15px] font-medium text-gray-500 dark:text-gray-400 mt-1">
            Organize. Prioritize. Get Things Done.
          </p>
        </div>
        
        <motion.button 
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleOpenCreate} 
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white rounded-[12px] text-[15px] font-semibold transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] border border-indigo-400/20 group relative overflow-hidden"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          
          <motion.div
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="group-hover:rotate-90"
          >
            <Plus size={18} strokeWidth={3} />
          </motion.div>
          New Task
        </motion.button>
      </motion.div>

      {/* Stats */}
      <TaskStats stats={stats} />

      {/* Filters */}
      <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Content area */}
      {loading ? (
        <SpinnerOverlay message="Loading tasks..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTasks} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={
            filters.search || filters.status || filters.priority
              ? 'No tasks match your filters'
              : 'No tasks yet'
          }
          description={
            filters.search || filters.status || filters.priority
              ? 'Try clearing some filters to see more tasks.'
              : 'Create your first task to get started!'
          }
          actionLabel={
            filters.search || filters.status || filters.priority
              ? undefined
              : 'Create First Task'
          }
          onAction={handleOpenCreate}
        />
      ) : (
        <>
          {/* Task grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id} // use id instead of _id for animation
                  task={task}
                  index={index}
                  onView={handleOpenView}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Floating Action Button (mobile) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenCreate}
        className="fixed bottom-6 right-6 sm:hidden flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-[0_8px_30px_rgba(79,70,229,0.3)] z-30"
        aria-label="Create new task"
      >
        <Plus size={26} strokeWidth={2.5} />
      </motion.button>

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setSelectedTask(null); }}
        task={selectedTask}
        onSubmit={handleFormSubmit}
        isLoading={formLoading}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={detailModalOpen}
        onClose={() => { setDetailModalOpen(false); setSelectedTask(null); }}
        task={selectedTask}
        onEdit={handleOpenEdit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setTaskToDelete(null); }}
        title="Delete Task"
        maxWidth="max-w-md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => { setDeleteModalOpen(false); setTaskToDelete(null); }}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={deleteLoading}
            >
              <Trash2 size={16} />
              Delete Task
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 mx-auto">
            <Trash2 size={26} className="text-red-500" />
          </div>
          <p className="text-center text-gray-700 dark:text-slate-300">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900 dark:text-slate-100">
              &quot;{taskToDelete?.title}&quot;
            </span>
            ?
          </p>
          <p className="text-center text-sm text-gray-500 dark:text-slate-400">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}
