"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const categories = [
  {
    title: "Kids Furniture",
    description: "Beautiful little spaces made for growing.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",
    href: "/shop",
  },
  {
    title: "Kitchen & Dining",
    description: "Thoughtful essentials for everyday living.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
    href: "/shop",
  },
  {
    title: "Living Room",
    description: "Comfort meets timeless design.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
    href: "/shop",
  },
  {
    title: "Bedroom",
    description: "Create your own calm and cozy retreat.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
    href: "/shop",
  },
];

export default function CategoryGrid() {
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Duplicate the cards to create a seamless infinite loop.
  const loopCategories = [...categories, ...categories];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrame;
    let previousTime = 0;
    let offset = 0;
    let halfWidth = 0;

    const measure = () => {
      halfWidth = track.scrollWidth / 2;
      setIsOverflowing(halfWidth > track.parentElement.clientWidth + 1);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    resizeObserver.observe(track.parentElement);

    const speed = 35; // pixels per second

    const animate = (time) => {
      if (!track.isConnected) return;

      if (previousTime) {
        const delta = Math.min((time - previousTime) / 1000, 0.05);

        if (!isPaused && halfWidth > 0) {
          offset = (offset + speed * delta) % halfWidth;
          track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }
      }

      previousTime = time;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [isPaused]);

  const moveCarousel = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.children[0];
    if (!firstCard) return;

    const distance =
      firstCard.getBoundingClientRect().width + 24;

    // Adjust the current offset by one card.
    const currentTransform = new DOMMatrixReadOnly(
      window.getComputedStyle(track).transform
    );

    let currentOffset = -currentTransform.m41;
    const halfWidth = track.scrollWidth / 2;

    currentOffset =
      (currentOffset + direction * distance + halfWidth) %
      halfWidth;

    track.style.transform = `translate3d(${-currentOffset}px, 0, 0)`;
  };

  return (
    <section className="overflow-hidden bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        {/* Section heading */}
        <div className="mb-9 flex items-end justify-between gap-5 sm:mb-12">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Shop by category
            </p>

            <h2 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              Discover Our Collections
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base">
              Explore thoughtfully curated pieces for every space in your home.
            </p>
          </div>

          {/* Navigation arrows */}
          {isOverflowing && (
            <div className="hidden flex-shrink-0 gap-3 sm:flex">
              <button
  type="button"
  onClick={() => {
    moveCarousel(-1);
    window.location.href = "/shop";
  }}
  aria-label="Previous collections"
  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
>
  <ArrowLeft size={19} />
</button>

<button
  type="button"
  onClick={() => {
    moveCarousel(1);
    window.location.href = "/shop";
  }}
  aria-label="Next collections"
  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
>
  <ArrowRight size={19} />
</button>
            </div>
          )}
        </div>

        {/* Continuous horizontal carousel */}
        <div
          className="-mx-5 overflow-hidden px-5 sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsPaused(false);
            }
          }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex w-max gap-5 sm:gap-6 lg:gap-7"
            style={{ willChange: "transform" }}
          >
            {loopCategories.map((category, index) => (
              <Link
                key={`${category.title}-${index}`}
                href={category.href}
                tabIndex={index < categories.length ? 0 : -1}
                aria-hidden={index >= categories.length}
                className="group w-[78vw] max-w-[380px] flex-shrink-0 overflow-hidden rounded-2xl bg-[#f9f9f9] transition-transform duration-300 hover:-translate-y-1 sm:w-[320px] lg:w-[calc((min(100vw-7rem,1600px)-5.25rem)/4)] lg:max-w-[390px]"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-[#f1eee9]">
                  <img
                    src={category.image}
                    alt={category.title}
                    loading="lazy"
                    draggable="false"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Card information */}
                <div className="flex min-h-[112px] items-start justify-between gap-4 bg-white px-5 py-5 sm:px-6 sm:py-6">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">
                      {category.title}
                    </h3>

                    <p className="mt-2 max-w-[240px] text-sm leading-6 text-neutral-500">
                      {category.description}
                    </p>
                  </div>

                  <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition-all duration-300 group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white">
                    <ArrowUpRight
                      size={19}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-3 text-xs tracking-wide text-neutral-400 sm:hidden">
          Auto-scrolling · Touch to pause
        </p>
      </div>
    </section>
  );
}