import type { InputHTMLAttributes, ReactNode } from "react";

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
  error?: string;
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
        <p className="text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

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
} & InputHTMLAttributes<HTMLInputElement>;

export function CheckboxField({
  label,
  hint,
  className = "",
  id,
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
          className="h-4 w-4 rounded border-ink/20 text-pine focus:ring-pine"
          {...props}
        />
        {label}
      </label>
      {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}
