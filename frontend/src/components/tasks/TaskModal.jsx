import { Modal } from '../ui/Modal';
import { TaskForm } from './TaskForm';

/**
 * Modal wrapper for creating and editing tasks
 * - task=null → create mode
 * - task=object → edit mode
 */
export function TaskModal({ isOpen, onClose, task, onSubmit, isLoading }) {
  const isEditing = Boolean(task);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      maxWidth="max-w-xl"
    >
      <TaskForm
        key={task?._id || 'new'}
        initialValues={task || {}}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
        submitLabel={isEditing ? 'Save Changes' : 'Create Task'}
      />
    </Modal>
  );
}
