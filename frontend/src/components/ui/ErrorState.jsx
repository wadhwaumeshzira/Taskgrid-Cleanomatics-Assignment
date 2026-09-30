import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

/**
 * Error state component with message and retry button
 */
export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-4 p-4 rounded-full bg-red-50 dark:bg-red-900/20">
        <AlertCircle size={40} className="text-red-500 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">
        Oops! An error occurred
      </h3>
      <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          <RefreshCw size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
}
