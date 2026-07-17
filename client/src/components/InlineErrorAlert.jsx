import { AlertCircle, RefreshCw } from 'lucide-react';

function InlineErrorAlert({
  title,
  message,
  onRetry,
  retryLabel = 'Try again',
  compact = false,
  borderless = false,
  children,
}) {
  return (
    <div
      className={
        borderless
          ? ''
          : compact
            ? 'rounded-md border border-red-200 bg-red-50 p-3'
            : 'rounded-lg border border-red-200 bg-red-50 p-6'
      }
      role="alert"
      aria-live="polite"
    >
      {title ? (
        <p className="text-sm font-medium text-red-800">{title}</p>
      ) : null}
      <p
        className={`flex items-start gap-2 text-sm text-red-700 ${title ? 'mt-1' : ''}`}
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {message}
      </p>
      {onRetry || children ? (
        <div className={`flex flex-wrap gap-3 ${compact ? 'mt-3' : 'mt-4'}`}>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className={
                compact
                  ? 'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-red-700 transition-colors hover:bg-red-100'
                  : 'inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm ring-1 ring-red-200 transition-colors hover:bg-red-100'
              }
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {retryLabel}
            </button>
          ) : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default InlineErrorAlert;
