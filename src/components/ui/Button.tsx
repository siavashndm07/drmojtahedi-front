import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-pine hover:bg-pine-dark text-white shadow-md hover:shadow-lg",
  secondary: "bg-ink/80 hover:bg-ink text-white shadow-md hover:shadow-lg",
  outline: "border-2 border-pine text-pine hover:bg-mint-soft dark:hover:bg-mint",
  ghost: "text-mint-deep hover:bg-mint-soft dark:hover:bg-mint",
  danger: "bg-danger hover:opacity-90 text-white shadow-md",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-6 py-3 text-lg",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  isLoading,
  leftIcon,
  rightIcon,
  fullWidth,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-mint-deep/40 focus:ring-offset-2 focus:ring-offset-cream",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span>در حال پردازش...</span>
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
