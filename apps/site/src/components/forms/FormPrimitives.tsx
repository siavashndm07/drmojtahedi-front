"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ButtonHTMLAttributes,
  type KeyboardEventHandler,
} from "react";
import { cn } from "@/lib/utils/cn";

/* ------------------------------- FormField ------------------------------ */
export function FormField({
  id,
  label,
  error,
  hint,
  required,
  children,
  className,
}: {
  id?: string;
  label?: ReactNode;
  error?: string | null;
  hint?: string;
  required?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <label
          htmlFor={id}
          className="flex items-center gap-1 text-sm font-semibold text-ink"
        >
          {label}
          {required ? <span className="text-danger">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-danger">
          <ErrorIcon />
          <span>{error}</span>
        </div>
      ) : null}
      {!error && hint ? (
        <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.25a.75.75 0 011.5 0v.01a.75.75 0 01-1.5 0V13.75zM10 5.5a.75.75 0 00-.75.75v4a.75.75 0 001.5 0v-4A.75.75 0 0010 5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const fieldBase =
  "w-full rounded-lg border bg-surface text-ink shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mint-deep/40 focus:border-mint-deep disabled:cursor-not-allowed disabled:bg-mint-soft disabled:text-ink-muted placeholder:text-ink-muted/70";

const fieldOk =
  "border-ink/15 hover:border-ink/30 dark:border-ink/20 dark:hover:border-ink/35";
const fieldError =
  "border-danger/50 focus:ring-danger/30 focus:border-danger bg-danger/5";

const sizeMap = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-5 py-3 text-lg",
} as const;

/* -------------------------------- TextBox -------------------------------- */
export type TextBoxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  error?: string | null;
  size?: keyof typeof sizeMap;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const TextBox = forwardRef<HTMLInputElement, TextBoxProps>(
  (
    {
      className,
      error,
      type,
      size = "md",
      leftIcon,
      rightIcon,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (type !== "number") return;
      if (
        [
          "Backspace",
          "Delete",
          "Tab",
          "Escape",
          "Enter",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "-",
          ".",
        ].includes(e.key)
      ) {
        return;
      }
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    };

    return (
      <div className="relative w-full">
        {leftIcon ? (
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-ink-muted">
            {leftIcon}
          </div>
        ) : null}
        <input
          ref={ref}
          {...rest}
          type={type}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          className={cn(
            fieldBase,
            error ? fieldError : fieldOk,
            sizeMap[size],
            leftIcon ? "pe-10" : undefined,
            rightIcon ? "ps-10" : undefined,
            className,
          )}
          aria-invalid={!!error}
        />
        {rightIcon ? (
          <div className="absolute inset-y-0 start-0 z-10 flex items-center ps-3">
            {rightIcon}
          </div>
        ) : null}
      </div>
    );
  },
);
TextBox.displayName = "TextBox";

/* -------------------------------- TextArea -------------------------------- */
export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string | null;
  size?: keyof typeof sizeMap;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, size = "md", rows = 4, disabled, ...rest }, ref) => (
    <textarea
      ref={ref}
      {...rest}
      rows={rows}
      disabled={disabled}
      className={cn(
        fieldBase,
        "resize-y",
        error ? fieldError : fieldOk,
        sizeMap[size],
        className,
      )}
      aria-invalid={!!error}
    />
  ),
);
TextArea.displayName = "TextArea";

/* -------------------------------- SelectBox ------------------------------- */
export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectBoxProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  options: SelectOption[];
  placeholder?: string;
  error?: string | null;
  size?: keyof typeof sizeMap;
};

export const SelectBox = forwardRef<HTMLSelectElement, SelectBoxProps>(
  (
    {
      options,
      placeholder = "انتخاب کنید",
      className,
      error,
      size = "md",
      disabled,
      ...rest
    },
    ref,
  ) => (
    <div className="relative w-full">
      <select
        ref={ref}
        {...rest}
        disabled={disabled}
        className={cn(
          fieldBase,
          "appearance-none pe-10",
          error ? fieldError : fieldOk,
          sizeMap[size],
          className,
        )}
        aria-invalid={!!error}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-ink-muted">
        <ChevronIcon />
      </div>
    </div>
  ),
);
SelectBox.displayName = "SelectBox";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("h-4 w-4", className)} fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* -------------------------------- RadioGroup ------------------------------ */
export function RadioGroup({
  name,
  value,
  onChange,
  options,
  direction = "row",
  error,
}: {
  name?: string;
  value?: string;
  onChange?: (val: string) => void;
  options: {
    value: string;
    label: ReactNode;
    disabled?: boolean;
    description?: ReactNode;
  }[];
  direction?: "row" | "col";
  error?: string | null;
}) {
  return (
    <div role="radiogroup" aria-label={name} aria-invalid={!!error}>
      <div
        className={cn(
          direction === "row" ? "flex flex-wrap gap-3" : "flex flex-col gap-2.5",
        )}
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "group relative inline-flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition",
                selected
                  ? "border-pine/40 bg-mint-soft/80 dark:border-pine/40 dark:bg-mint"
                  : "border-ink/10 bg-surface hover:border-pine/25 dark:hover:bg-mint/40",
                opt.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                disabled={opt.disabled}
                onChange={() => onChange?.(opt.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                  selected
                    ? "border-pine bg-pine text-white"
                    : "border-ink/25 bg-surface",
                )}
                aria-hidden
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full bg-white transition",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">{opt.label}</span>
                {opt.description ? (
                  <span className="mt-0.5 block text-xs leading-6 text-ink-muted">
                    {opt.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
          <ErrorIcon />
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------- Checkbox -------------------------------- */
export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  description?: ReactNode;
  error?: string | null;
  variant?: "default" | "card";
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      className,
      checked,
      error,
      disabled,
      variant = "default",
      id,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? (typeof rest.name === "string" ? rest.name : undefined);
    const isCard = variant === "card";

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <label
          htmlFor={inputId}
          className={cn(
            "group relative inline-flex cursor-pointer gap-3 transition",
            isCard && "w-full items-start rounded-xl border px-3.5 py-3",
            isCard &&
              (checked
                ? "border-pine/40 bg-mint-soft/80 dark:border-pine/40 dark:bg-mint"
                : "border-ink/10 bg-surface hover:border-pine/25 dark:hover:bg-mint/40"),
            !isCard && "items-center",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            {...rest}
            className="peer sr-only"
            aria-invalid={!!error}
          />
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-pine/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface",
              checked ? "border-pine bg-pine text-white" : "border-ink/25 bg-surface",
              isCard && "mt-0.5",
              error && !checked && "border-danger",
            )}
            aria-hidden
          >
            <CheckIcon
              className={cn(
                "h-3 w-3 transition",
                checked ? "scale-100 opacity-100" : "scale-75 opacity-0",
              )}
            />
          </span>
          {label || description ? (
            <span className="min-w-0 flex-1">
              {label ? (
                <span className="block text-sm font-medium text-ink">{label}</span>
              ) : null}
              {description ? (
                <span className="mt-0.5 block text-xs leading-6 text-ink-muted">
                  {description}
                </span>
              ) : null}
            </span>
          ) : null}
        </label>
        {error ? (
          <div className="flex items-center gap-1.5 text-xs text-danger">
            <ErrorIcon />
            <span>{error}</span>
          </div>
        ) : null}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 011.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* -------------------------------- Button -------------------------------- */
export type FormButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

const buttonVariants = {
  primary: "bg-pine hover:bg-pine-dark text-white shadow-md hover:shadow-lg",
  secondary: "bg-ink/80 hover:bg-ink text-white shadow-md hover:shadow-lg",
  outline: "border-2 border-pine text-pine hover:bg-mint-soft dark:hover:bg-mint",
  ghost: "text-mint-deep hover:bg-mint-soft dark:hover:bg-mint",
  danger: "bg-danger hover:opacity-90 text-white shadow-md hover:shadow-lg",
} as const;

export const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      fullWidth,
      disabled,
      className,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-mint-deep/40 focus:ring-offset-2 focus:ring-offset-cream",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        buttonVariants[variant],
        sizeMap[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span>در حال پردازش...</span>
        </>
      ) : (
        <>
          {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
          {children}
          {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
        </>
      )}
    </button>
  ),
);
FormButton.displayName = "FormButton";

/* ------------------------------ File input ------------------------------ */
export function FileField({
  id,
  label,
  hint,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string | null;
}) {
  return (
    <FormField id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        type="file"
        className={cn(
          "block w-full text-sm text-ink-muted file:me-3 file:rounded-lg file:border-0 file:bg-mint-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-pine hover:file:bg-mint",
        )}
        {...props}
      />
    </FormField>
  );
}

/* --------------------------- Controlled helpers --------------------------- */
export function useCheckboxState(initial = false) {
  const [checked, setChecked] = useState(initial);
  return {
    checked,
    onChange: (event: { target: { checked: boolean } }) => {
      setChecked(event.target.checked);
    },
    setChecked,
  };
}
