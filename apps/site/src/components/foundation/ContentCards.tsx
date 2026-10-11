import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils/cn";

export function GatewayGrid({
  items,
}: {
  items: {
    href: string;
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
}) {
  return (
    <FadeIn>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-44 flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
          >
            <IconBadge icon={item.icon} />
            <div>
              <h2 className="text-xl font-medium group-hover:text-pine">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-ink-muted">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </FadeIn>
  );
}

function CardMedia({
  title,
  image,
  icon: Icon,
}: {
  title: string;
  image?: { src: string; alt: string };
  icon?: LucideIcon;
}) {
  if (image) {
    return (
      <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-mint-soft">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
      </div>
    );
  }

  const initial = title.trim().slice(0, 1) || "·";

  return (
    <div className="relative mb-4 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-mint-soft via-cream to-bronze/15 dark:from-mint/40 dark:via-surface dark:to-pine/20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(47,127,120,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(166,124,82,0.25), transparent 40%)",
        }}
        aria-hidden
      />
      {Icon ? (
        <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-surface/90 text-pine shadow-sm ring-1 ring-ink/5">
          <Icon className="size-6" strokeWidth={1.7} aria-hidden />
        </span>
      ) : (
        <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-surface/90 text-display text-2xl text-pine shadow-sm ring-1 ring-ink/5">
          {initial}
        </span>
      )}
    </div>
  );
}

export function ContentCardGrid({
  items,
  columns = "md:grid-cols-2 lg:grid-cols-3",
}: {
  items: {
    key: string;
    href?: string;
    title: string;
    description?: string;
    meta?: string;
    badge?: string;
    comingSoon?: boolean;
    image?: { src: string; alt: string };
    icon?: LucideIcon;
  }[];
  columns?: string;
}) {
  return (
    <ul className={cn("grid gap-4", columns)}>
      {items.map((item) => {
        const inner = (
          <>
            <CardMedia title={item.title} image={item.image} icon={item.icon} />
            <div className="flex flex-wrap items-center gap-2">
              {item.badge ? <Badge tone="pine">{item.badge}</Badge> : null}
              {item.comingSoon ? <Badge tone="placeholder">به‌زودی</Badge> : null}
            </div>
            <h3 className="mt-3 text-lg font-medium text-ink group-hover:text-pine">
              {item.title}
            </h3>
            {item.meta ? <p className="mt-1 text-xs text-bronze">{item.meta}</p> : null}
            {item.description ? (
              <p className="mt-3 text-sm leading-7 text-ink-muted">{item.description}</p>
            ) : null}
          </>
        );

        return (
          <li key={item.key}>
            {item.href ? (
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
              >
                {inner}
              </Link>
            ) : (
              <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm">
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
