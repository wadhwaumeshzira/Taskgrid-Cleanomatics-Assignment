import { useState, useEffect } from 'react';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

function validate(values) {
  const errors = {};
  if (!values.title?.trim()) errors.title = 'Title is required';
  else if (values.title.trim().length < 3) errors.title = 'Title must be at least 3 characters';
  if (!values.description?.trim()) errors.description = 'Description is required';
  return errors;
}

/**
 * Task form component with validation, all fields, and loading state
 */
export function TaskForm({
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save Task',
}) {
  const [values, setValues] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    ...initialValues,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Keep form in sync if initialValues changes (e.g., switching tasks in modal)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setValues({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        ...initialValues,
        dueDate: initialValues.dueDate
          ? new Date(initialValues.dueDate).toISOString().split('T')[0]
          : '',
      });
      setErrors({});
      setTouched({});
    }
  }, [initialValues?.id]); // only reset when task ID changes

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const errs = validate({ ...values, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(values);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = { title: true, description: true };
    setTouched(allTouched);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = { ...values };
    if (!payload.dueDate) delete payload.dueDate;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        label="Title"
        required
        placeholder="Enter task title..."
        value={values.title}
        onChange={(e) => handleChange('title', e.target.value)}
        onBlur={() => handleBlur('title')}
        error={touched.title ? errors.title : undefined}
      />

      <Textarea
        label="Description"
        required
        rows={4}
        placeholder="Describe the task in detail..."
        value={values.description}
        onChange={(e) => handleChange('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          value={values.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={STATUS_OPTIONS}
        />
        <Select
          label="Priority"
          value={values.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          options={PRIORITY_OPTIONS}
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        value={values.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
        helperText="Optional — leave blank if no deadline"
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isLoading} disabled={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
