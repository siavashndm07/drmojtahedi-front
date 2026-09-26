"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { HeroPagination } from "@/components/homepage/HeroPagination";
import type { HeroSlide } from "@/lib/mock/hero";
import { cn } from "@/lib/utils/cn";

import "swiper/css";

const BOMIJA_BREAKPOINTS = {
  0: { slidesPerView: 1.1, spaceBetween: 12 },
  640: { slidesPerView: 1.15, spaceBetween: 16 },
  1024: { slidesPerView: 1.1, spaceBetween: 16 },
} as const;

const tonePanel: Record<HeroSlide["tone"], string> = {
  pine: "from-pine-dark via-pine to-pine-dark",
  ink: "from-ink via-[#2a2624] to-pine-dark",
  bronze: "from-[#5c4a36] via-bronze to-pine-dark",
};

type HeroBomijaCarouselProps = {
  slides: HeroSlide[];
  autoplayDelay: number;
};

export function HeroBomijaCarousel({
  slides,
  autoplayDelay,
}: HeroBomijaCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const canLoop = slides.length > 1;
  const useSwiperLoop = slides.length >= 3;
  const useSwiperRewind = slides.length === 2;

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
      className="relative overflow-hidden bg-cream pt-4 pb-6 dark:bg-cream sm:pt-6 sm:pb-8"
      aria-labelledby="hero-heading"
    >
      <div className="content-wide">
        <div className="relative overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            loop={useSwiperLoop}
            rewind={useSwiperRewind}
            speed={650}
            breakpoints={BOMIJA_BREAKPOINTS}
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
            className="heritage-hero-bomija rounded-xl sm:rounded-2xl"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <article className="relative overflow-hidden rounded-xl shadow-card ring-1 ring-ink/5 sm:rounded-2xl">
                  <div
                    className={cn(
                      "relative aspect-[16/7] w-full bg-gradient-to-br sm:aspect-[16/6] lg:aspect-[1715/453]",
                      tonePanel[slide.tone],
                    )}
                  >
                    <Image
                      src={slide.mobileImage || slide.image}
                      alt={slide.imageAlt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 1280px"
                      className="object-contain object-center p-[12%] opacity-95 brightness-0 invert sm:hidden"
                    />
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 1280px"
                      className="hidden object-contain object-center p-[10%] opacity-95 brightness-0 invert sm:block"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"
                      aria-hidden
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                      <div className="min-w-0">
                        {index === 0 ? (
                          <h1
                            id="hero-heading"
                            className="line-clamp-2 text-base font-bold text-white sm:text-lg"
                          >
                            {slide.title}
                          </h1>
                        ) : (
                          <p className="line-clamp-2 text-base font-bold text-white sm:text-lg">
                            {slide.title}
                          </p>
                        )}
                      </div>
                      <Link
                        href={slide.ctaHref}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-pine shadow-sm transition hover:bg-mint-soft sm:px-5 sm:py-2.5 sm:text-sm"
                      >
                        {slide.ctaLabel}
                        <ArrowLeft className="size-3.5 sm:size-4" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {canLoop ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center sm:bottom-7">
              <div className="pointer-events-auto">
                <HeroPagination
                  count={slides.length}
                  current={current}
                  progress={progress}
                  onSelect={(index) => {
                    const swiper = swiperRef.current;
                    if (!swiper) return;
                    if (useSwiperLoop) swiper.slideToLoop(index);
                    else swiper.slideTo(index);
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
