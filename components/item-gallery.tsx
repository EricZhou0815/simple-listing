"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fallbackImage } from "@/lib/items";

export function ItemGallery({ images, title }: { images: string[]; title: string }) {
  const slides = useMemo(() => (images.length ? images : [fallbackImage]), [images]);
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const prev = () => setIndex((current) => (current - 1 + slides.length) % slides.length);
  const next = () => setIndex((current) => (current + 1) % slides.length);

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden rounded-2xl bg-muted"
        onTouchStart={(e) => setTouchStartX(e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touchStartX == null) return;
          const endX = e.changedTouches[0]?.clientX ?? touchStartX;
          const delta = endX - touchStartX;
          if (Math.abs(delta) > 40) {
            if (delta < 0) next();
            else prev();
          }
          setTouchStartX(null);
        }}
      >
        <div className="relative aspect-[4/3] w-full">
          <Image src={slides[index]} alt={`${title} photo ${index + 1}`} fill className="object-cover" priority />
        </div>

        {slides.length > 1 ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 shadow-sm"
              onClick={prev}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 shadow-sm"
              onClick={next}
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {slides.map((src, dotIndex) => (
            <button
              key={src + dotIndex}
              type="button"
              className={`relative h-20 w-20 flex-none overflow-hidden rounded-xl border transition-all ${
                dotIndex === index ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70"
              }`}
              onClick={() => setIndex(dotIndex)}
              aria-label={`Show photo ${dotIndex + 1}`}
            >
              <Image src={src} alt={`${title} thumbnail ${dotIndex + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
