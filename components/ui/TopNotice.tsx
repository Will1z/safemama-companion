import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopNoticeProps {
  message: string;
  type?: 'info' | 'warning' | 'error';
  onDismiss?: () => void;
  className?: string;
}

const typeStyles = {
  info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-200 dark:border-blue-800',
  warning: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/20 dark:text-gray-200 dark:border-gray-800',
  error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-200 dark:border-red-800'
};

export function TopNotice({ message, type = 'warning', onDismiss, className }: TopNoticeProps) {
  return (
    <div className={cn(
      'px-4 py-3 border-b text-sm',
      typeStyles[type],
      className
    )}>
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">
            {message}
          </span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 focus-ring"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}