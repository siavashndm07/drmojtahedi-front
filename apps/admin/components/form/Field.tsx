import type { InputHTMLAttributes, ReactNode } from "react";

function ErrorCaption({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-1.5 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
      <svg
        viewBox="0 0 20 20"
        className="mt-0.5 h-3.5 w-3.5 shrink-0"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.25a.75.75 0 011.5 0v.01a.75.75 0 01-1.5 0V13.75zM10 5.5a.75.75 0 00-.75.75v4a.75.75 0 001.5 0v-4A.75.75 0 0010 5.5z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </p>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`.trim()}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <ErrorCaption message={error} />
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

/** Desktop form dialogs: wide panel, two fields per row, full-width groups. */
export const formDialogClassName =
  "relative max-h-[min(92vh,52rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-ink/10 bg-surface p-5 shadow-xl sm:p-6";

export const formDialogFieldsClassName =
  "grid grid-cols-1 items-start gap-4 md:grid-cols-2";

export const formDialogFullClassName = "md:col-span-2";

export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-ink/10 pt-4">
      {children}
    </div>
  );
}

export function FormCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`max-w-2xl space-y-4 rounded-2xl border border-ink/10 bg-surface p-5 ${className}`.trim()}
    >
      {children}
    </div>
  );
}

type CheckboxFieldProps = {
  label: string;
  hint?: string;
  error?: string | null;
} & InputHTMLAttributes<HTMLInputElement>;

export function CheckboxField({
  label,
  hint,
  error,
  className = "",
  id,
  required: _required,
  ...props
}: CheckboxFieldProps) {
  const fieldId = id ?? props.name;
  return (
    <div className={`space-y-1 ${className}`.trim()}>
      <label
        htmlFor={fieldId}
        className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
      >
        <input
          id={fieldId}
          type="checkbox"
          required={false}
          aria-invalid={error ? true : undefined}
          className={`h-4 w-4 rounded border-ink/20 text-pine focus:ring-pine ${
            error ? "border-red-500" : ""
          }`}
          {...props}
        />
        {label}
      </label>
      {error ? (
        <ErrorCaption message={error} />
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}
