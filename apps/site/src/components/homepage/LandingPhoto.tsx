"use client";

import { useState } from "react";
import Image from "next/image";

export function LandingPhoto({
  src,
  fallback,
  alt,
  sizes,
  className,
}: {
  src: string;
  fallback: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(src);

  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
