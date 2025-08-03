"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HomeSlide {
  id: string;
  title: string | null;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaLink: string | null;
  imagePc: string;
  imageTablet: string;
  imageMobile: string;
  titleColor: string | null;
  subtitleColor: string | null;
}

const sanitizeTailwindClass = (input?: string | null, fallback = "") =>
  typeof input === "string" && /^[\w\-:/]+$/.test(input.trim())
    ? input.trim()
    : fallback;

export default function Header() {
  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch("/api/home-carousel"); // Make sure this matches the API route!
        const data = await res.json();
        setSlides(data);
      } catch (err) {
        console.error("Failed to load header slides", err);
      }
    }
    fetchSlides();
  }, []);

  // Optional autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        slides.length ? (prev + 1) % slides.length : 0
      );
    }, 5000); // 8 seconds per slide
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[80vh] w-full">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-1000",
              i === activeIndex
                ? "opacity-100 z-10 animate-fade"
                : "opacity-0 z-0"
            )}
          >
            <picture>
              <source media="(min-width: 1024px)" srcSet={slide.imagePc} />
              <source media="(min-width: 640px)" srcSet={slide.imageTablet} />
              <Image
                src={slide.imageMobile}
                alt={slide.title || "Slide"}
                fill
                priority={i === 0}
                className="object-cover w-full h-full"
              />
            </picture>

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/30">
              {slide.title && (
                <h1
                  className={cn(
                    "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight drop-shadow-2xl",
                    sanitizeTailwindClass(slide.titleColor, "text-white")
                  )}
                >
                  {slide.title}
                </h1>
              )}
              {slide.subtitle && (
                <p
                  className={cn(
                    "text-lg sm:text-xl md:text-2xl font-medium leading-relaxed mt-4 drop-shadow-lg",
                    sanitizeTailwindClass(slide.subtitleColor, "text-white/90")
                  )}
                >
                  {slide.subtitle}
                </p>
              )}
              {slide.ctaLink && slide.ctaLabel && (
                <Link
                  href={slide.ctaLink}
                  className="mt-8 inline-block bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
                >
                  {slide.ctaLabel}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
