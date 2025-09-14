import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopNoticeProps {
  message: string;
  type?: 'info' | 'warning' | 'error';
  onDismiss?: () => void;
  className?: string;
}

const typeStyles = {
  info: 'bg-[rgb(var(--info))]/60 text-[rgb(var(--info-foreground))] border-[rgb(var(--info))]',
  warning: 'bg-[rgb(var(--warning))]/60 text-[rgb(var(--warning-foreground))] border-[rgb(var(--warning))]',
  error: 'bg-[rgb(var(--destructive))]/60 text-[rgb(var(--destructive-foreground))] border-[rgb(var(--destructive))]'
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