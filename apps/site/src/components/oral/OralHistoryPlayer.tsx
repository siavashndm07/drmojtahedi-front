"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mic, Pause, Play } from "lucide-react";
import type { OralHistoryInterview } from "@/lib/mock/oralHistory";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

export function OralHistoryPlayer({
  interview,
}: {
  interview: OralHistoryInterview;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasAudio = Boolean(interview.audioSrc);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      if (!el.duration) return;
      setProgress((el.currentTime / el.duration) * 100);
    };
    const onEnded = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [interview.audioSrc]);

  async function toggle() {
    if (!hasAudio || !audioRef.current) {
      setPlaying((p) => !p);
      if (!playing) {
        // Mock progress animation when no file
        setProgress(0);
        const start = Date.now();
        const id = window.setInterval(() => {
          const t = (Date.now() - start) / 12000;
          if (t >= 1) {
            setProgress(100);
            setPlaying(false);
            window.clearInterval(id);
          } else {
            setProgress(t * 100);
          }
        }, 100);
      }
      return;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      await audioRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm">
      <div className="border-b border-ink/10 bg-gradient-to-l from-mint-soft/80 to-transparent px-5 py-4 dark:from-mint/30 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="pine">تاریخ شفاهی</Badge>
          {interview.status === "coming-soon" ? (
            <Badge tone="placeholder">به‌زودی</Badge>
          ) : null}
          <span className="text-xs text-ink-muted">{interview.year}</span>
        </div>
        <h2 className="mt-3 text-display text-xl text-ink sm:text-2xl">
          {interview.title}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">{interview.subtitle}</p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <p className="text-sm leading-8 text-ink-muted">{interview.description}</p>

        <div className="rounded-2xl border border-ink/10 bg-cream/50 p-4 dark:bg-ink/10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void toggle()}
              className={cn(
                "inline-flex size-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition",
                playing ? "bg-pine-dark" : "bg-pine hover:bg-pine-dark",
              )}
              aria-label={playing ? "توقف" : "پخش"}
            >
              {playing ? (
                <Pause className="size-5" aria-hidden />
              ) : (
                <Play className="size-5 ps-0.5" aria-hidden />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  <Mic className="size-3.5" aria-hidden />
                  {interview.narrator}
                </span>
                <span>{interview.durationLabel}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-pine transition-[width] duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {!hasAudio ? (
                <p className="mt-2 text-[11px] text-ink-muted">
                  فایل صوتی هنوز بارگذاری نشده — پخش نمایشی است.
                </p>
              ) : null}
            </div>
          </div>
          {hasAudio ? (
            <audio ref={audioRef} src={interview.audioSrc!} preload="none" className="hidden" />
          ) : null}
        </div>

        <blockquote className="border-s-4 border-pine/40 bg-mint-soft/40 px-4 py-3 text-sm leading-8 text-ink dark:bg-mint/20">
          {interview.transcriptExcerpt}
        </blockquote>

        <div className="flex flex-wrap gap-3 text-sm">
          {interview.relatedHref ? (
            <Link
              href={interview.relatedHref}
              className="font-semibold text-pine hover:underline"
            >
              {interview.relatedLabel ?? "مرتبط"}
            </Link>
          ) : null}
          <span className="text-xs text-ink-muted">منبع: {interview.source}</span>
        </div>
      </div>
    </article>
  );
}
