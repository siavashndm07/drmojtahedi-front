"use client";

import { useEffect, useState } from "react";

export function ArticleReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const article = document.getElementById("article-content");
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const start = window.scrollY + rect.top - 80;
      const height = article.offsetHeight;
      const viewport = window.innerHeight;
      const max = Math.max(height - viewport * 0.4, 1);
      const current = window.scrollY - start;
      setProgress(Math.min(100, Math.max(0, (current / max) * 100)));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-ink/5"
      aria-hidden
    >
      <div
        className="h-full bg-gradient-to-l from-mint-deep to-pine transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
