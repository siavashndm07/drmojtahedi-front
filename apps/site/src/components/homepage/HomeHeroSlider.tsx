"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { HeroBomijaCarousel } from "@/components/homepage/HeroBomijaCarousel";
import { HeroPagination } from "@/components/homepage/HeroPagination";
import {
  DEFAULT_HERO_AUTOPLAY_DELAY_MS,
  normalizeHeroTemplateId,
  type HeroTemplateId,
} from "@/lib/hero/templates";
import type { HeroSlide } from "@/lib/mock/hero";
import { mockHeroSlides } from "@/lib/mock/hero";
import { siteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils/cn";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const HERO_ASPECT_FULL =
  "aspect-[4/5] min-h-[22rem] sm:aspect-[2000/780] sm:min-h-0";

const tonePanel: Record<HeroSlide["tone"], string> = {
  pine: "from-pine-dark via-pine to-[#1a3d3a]",
  ink: "from-ink via-[#2a2624] to-pine-dark",
  bronze: "from-[#5c4a36] via-bronze to-pine-dark",
};

const toneGlow: Record<HeroSlide["tone"], string> = {
  pine: "bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.2),transparent_45%)]",
  ink: "bg-[radial-gradient(circle_at_70%_30%,rgb(122_168_112/0.3),transparent_50%)]",
  bronze:
    "bg-[radial-gradient(circle_at_40%_10%,rgb(255_255_255/0.16),transparent_48%)]",
};

function HeroCtaButtons({
  slide,
  showSecondary = true,
}: {
  slide: HeroSlide;
  showSecondary?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={slide.ctaHref}
        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-pine shadow-sm transition hover:bg-mint-soft sm:px-6 sm:py-3"
      >
        {slide.ctaLabel}
        <ArrowLeft className="size-4" aria-hidden />
      </Link>
      {showSecondary && slide.secondaryCtaLabel && slide.secondaryCtaHref ? (
        <Link
          href={slide.secondaryCtaHref}
          className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:px-6 sm:py-3"
        >
          {slide.secondaryCtaLabel}
        </Link>
      ) : null}
    </div>
  );
}

function HeroSlideMedia({ slide, index }: { slide: HeroSlide; index: number }) {
  return (
    <div className={cn("absolute inset-0 bg-gradient-to-br", tonePanel[slide.tone])}>
      <div className={cn("absolute inset-0", toneGlow[slide.tone])} aria-hidden />

      <Image
        src={slide.mobileImage || slide.image}
        alt={slide.imageAlt}
        fill
        priority={index === 0}
        sizes="100vw"
        className="object-cover object-center sm:hidden"
      />
      <Image
        src={slide.image}
        alt={slide.imageAlt}
        fill
        priority={index === 0}
        sizes="100vw"
        className="hidden object-cover object-center sm:block"
      />
    </div>
  );
}
function HeroSlideOverlay({
  slide,
  index,
  variant,
}: {
  slide: HeroSlide;
  index: number;
  variant: "fullBleed" | "splitText";
}) {
  const showText = variant === "splitText";

  return (
    <div className="relative h-full w-full">
      <HeroSlideMedia slide={slide} index={index} />
      <div
        className={cn(
          "absolute inset-0",
          showText
            ? "bg-gradient-to-t from-pine/90 via-pine/45 to-pine/15 sm:from-pine/85 sm:via-pine/40"
            : "bg-gradient-to-t from-pine/55 via-transparent to-transparent sm:from-pine/45",
        )}
        aria-hidden
      />

      <div className="absolute inset-0 flex items-end">
        <div className="content-wide relative w-full pb-16 pt-6 sm:pb-16">
          {showText ? (
            <div className="mb-5 max-w-xl space-y-2 sm:mb-6">
              {slide.eyebrow?.trim() ? (
                <p className="text-xs font-semibold tracking-wide text-mint-soft/90 sm:text-sm">
                  {slide.eyebrow}
                </p>
              ) : null}
              {index === 0 ? (
                <h1
                  id="hero-heading"
                  className="text-display text-2xl leading-tight text-white sm:text-3xl lg:text-4xl"
                >
                  {slide.title}
                  {slide.subtitle ? (
                    <span className="mt-1 block text-lg font-semibold text-white/90 sm:text-xl">
                      {slide.subtitle}
                    </span>
                  ) : null}
                </h1>
              ) : (
                <h2 className="text-display text-2xl leading-tight text-white sm:text-3xl lg:text-4xl">
                  {slide.title}
                  {slide.subtitle ? (
                    <span className="mt-1 block text-lg font-semibold text-white/90 sm:text-xl">
                      {slide.subtitle}
                    </span>
                  ) : null}
                </h2>
              )}
              {slide.description?.trim() ? (
                <p className="max-w-lg text-sm leading-7 text-white/85 sm:text-base">
                  {slide.description}
                </p>
              ) : null}
            </div>
          ) : index === 0 ? (
            <h1 id="hero-heading" className="sr-only">
              {slide.title} {slide.subtitle}
            </h1>
          ) : null}
          <HeroCtaButtons slide={slide} showSecondary />
        </div>
      </div>
    </div>
  );
}

function HeroFullWidthSwiper({
  slides,
  variant,
  autoplayDelay,
}: {
  slides: HeroSlide[];
  variant: "fullBleed" | "splitText";
  autoplayDelay: number;
}) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const canLoop = slides.length > 1;

  useEffect(() => {
    setProgress(0);
    if (!canLoop) return;
    const interval = 50;
    const step = (interval / autoplayDelay) * 100;
    const timer = window.setInterval(() => {
      setProgress((prev) => (prev + step >= 100 ? 100 : prev + step));
    }, interval);
    return () => window.clearInterval(timer);
  }, [current, autoplayDelay, canLoop]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper?.autoplay || !canLoop) return;
    swiper.params.autoplay = {
      ...(typeof swiper.params.autoplay === "object" ? swiper.params.autoplay : {}),
      delay: autoplayDelay,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    };
    swiper.autoplay.stop();
    swiper.autoplay.start();
  }, [autoplayDelay, canLoop]);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-pine"
      aria-labelledby="hero-heading"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={canLoop && slides.length >= 2}
        speed={900}
        autoplay={
          canLoop
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setCurrent(swiper.realIndex)}
        className={cn("heritage-hero-full w-full", HERO_ASPECT_FULL)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="!h-full">
            <HeroSlideOverlay slide={slide} index={index} variant={variant} />
          </SwiperSlide>
        ))}
      </Swiper>

      {canLoop ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div className="content-wide flex items-center justify-between gap-4 pb-4 pt-2 sm:pb-5">
            <div className="hidden w-[5.5rem] sm:block" aria-hidden />
            <div className="pointer-events-auto flex flex-1 justify-center">
              <HeroPagination
                count={slides.length}
                current={current}
                progress={progress}
                onSelect={(index) => swiperRef.current?.slideToLoop(index)}
              />
            </div>
            <div className="pointer-events-auto flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="اسلاید قبلی"
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-pine sm:size-11"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <ChevronRight className="size-4 sm:size-5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="اسلاید بعدی"
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-pine sm:size-11"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <ChevronLeft className="size-4 sm:size-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function HomeHeroSlider({
  slides = mockHeroSlides,
  template,
  autoplayDelay = siteSettings.heroAutoplayDelay ?? DEFAULT_HERO_AUTOPLAY_DELAY_MS,
}: {
  slides?: HeroSlide[];
  /** Override site setting. Defaults to `fullBleed`. */
  template?: HeroTemplateId;
  autoplayDelay?: number;
}) {
  const resolved = normalizeHeroTemplateId(
    template ?? siteSettings.heroTemplate,
  );

  if (resolved === "minimalCta") {
    return (
      <HeroBomijaCarousel slides={slides} autoplayDelay={autoplayDelay} />
    );
  }

  return (
    <HeroFullWidthSwiper
      slides={slides}
      variant={resolved}
      autoplayDelay={autoplayDelay}
    />
  );
}
