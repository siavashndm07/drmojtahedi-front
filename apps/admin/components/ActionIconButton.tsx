import Link from "next/link";
import type { ReactNode } from "react";

type ActionIconButtonProps = {
  label: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  variant?: "default" | "primary" | "muted";
  disabled?: boolean;
};

const variantClass = {
  default:
    "border-ink/10 text-ink-muted hover:border-pine/30 hover:bg-mint-soft/40 hover:text-pine",
  primary:
    "border-pine/20 bg-mint-soft/50 text-pine hover:bg-mint-soft dark:bg-mint",
  muted:
    "border-transparent text-ink-muted hover:border-ink/10 hover:bg-cream hover:text-ink",
};

export default function ActionIconButton({
  label,
  children,
  href,
  onClick,
  external,
  variant = "default",
  disabled = false,
}: ActionIconButtonProps) {
  const className = `inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${variantClass[variant]} disabled:cursor-not-allowed disabled:opacity-50`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={className}
          aria-label={label}
          title={label}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={className} aria-label={label} title={label}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
