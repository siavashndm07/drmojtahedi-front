import Image from "next/image";
import { BookOpen, GraduationCap, Landmark, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Article } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const tonePanel: Record<NonNullable<Article["coverTone"]>, string> = {
  pine: "from-pine-dark via-pine to-[#1a3d3a]",
  ink: "from-ink via-[#2a2624] to-pine-dark",
  bronze: "from-[#5c4a36] via-bronze to-pine-dark",
};

const categoryIcon: Record<string, LucideIcon> = {
  آموزش: GraduationCap,
  نهادها: Landmark,
  "زندگی‌نامه": BookOpen,
  میراث: Sparkles,
};

export function ArticleCover({
  article,
  className,
  priority = false,
  sizes = "100vw",
}: {
  article: Article;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const tone = article.coverTone ?? "pine";
  const Icon = categoryIcon[article.category ?? ""] ?? BookOpen;
  const src = article.heroImage?.src;

  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-cream", className)}>
        <Image
          src={src}
          alt={article.heroImage?.alt ?? article.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        tonePanel[tone],
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-35"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 25%, white 0 1.5px, transparent 2px), radial-gradient(circle at 80% 70%, white 0 1px, transparent 1.5px)",
          backgroundSize: "26px 26px, 18px 18px",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-white">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20 backdrop-blur-sm">
          <Icon className="size-5" strokeWidth={1.7} aria-hidden />
        </span>
        {article.category ? (
          <p className="text-xs font-semibold tracking-wide text-white/70">
            {article.category}
          </p>
        ) : null}
      </div>
    </div>
  );
}
