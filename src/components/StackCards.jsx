
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const collections = [
  {
    id: "sofas",
    number: "01",
    eyebrow: "COMFORT, REDEFINED",
    title: "COZY FABRIC SOFAS",
    description:
      "Sink into everyday luxury. Discover beautifully crafted sofas that bring warmth, comfort, and timeless character to your living space.",
    button: "SHOP SOFAS",
    href: "/shop?category=sofas",
    theme: "light",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Contemporary sofa in a stylish living room",
  },
  {
    id: "lamps",
    number: "02",
    eyebrow: "LIGHT UP YOUR WORLD",
    title: "ELEGANT LIVING ROOM LAMPS",
    description:
      "Set the mood with sculptural silhouettes and warm ambient lighting. Find the finishing touch that makes your room feel extraordinary.",
    button: "SHOP LIGHTING",
    href: "/shop?category=lighting",
    theme: "dark",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Elegant contemporary lamp and warm interior lighting",
  },
];

export default function StackedCards() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll(".stacked-card");
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    let observer;

    function setupObserver() {
      observer?.disconnect();
      setActiveIndex(0);

      if (!mediaQuery.matches) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(Number(entry.target.dataset.index));
            }
          });
        },
        {
          rootMargin: "-20% 0px -60% 0px",
          threshold: 0,
        }
      );

      cards.forEach((card) => observer.observe(card));
    }

    setupObserver();
    mediaQuery.addEventListener("change", setupObserver);

    return () => {
      observer?.disconnect();
      mediaQuery.removeEventListener("change", setupObserver);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#f8f7f4] px-5 py-20 text-[#222] sm:px-8 md:px-[5%] md:py-28"
    >
      {/* Section heading */}
      <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
        <span className="text-[10px] font-semibold tracking-[3px] text-[#9b7953]">
          THE MINICOM EDIT
        </span>

        <h2 className="mt-5 text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
          Make room for
          <br />
          <span className="font-serif italic text-[#9b7953]">
            better living.
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-neutral-500 md:text-base">
          Thoughtful pieces. Beautiful spaces. Everyday living,
          elevated.
        </p>
      </div>

      {/* Stacked cards */}
      <div className="mx-auto max-w-[1440px]">
        {collections.map((item, index) => (
          <article
            key={item.id}
            data-index={index}
            className={`
              stacked-card relative mb-7 grid grid-cols-1
              overflow-hidden rounded-sm shadow-xl
              transition-[transform,opacity] duration-500 ease-out
              motion-reduce:transition-none
              md:sticky md:mb-0 md:min-h-[min(650px,76vh)]
              md:grid-cols-[0.82fr_1.18fr]
              ${
                index < activeIndex
                  ? "md:scale-[0.95] md:opacity-70"
                  : "scale-100 opacity-100"
              }
              ${
                item.theme === "light"
                  ? "bg-[#eee9df] text-[#24211e]"
                  : "bg-[#191919] text-white"
              }
            `}
            style={{
              top: `calc(90px + ${index * 14}px)`,
              zIndex: index + 1,
            }}
          >
            {/* Left content */}
            <div className="flex min-h-[370px] flex-col items-start justify-center px-7 py-10 sm:px-10 md:min-h-0 md:px-12 md:py-14 lg:px-16 lg:py-20">
              <span
                className={`text-[10px] font-semibold tracking-[2px] ${
                  item.theme === "light"
                    ? "text-[#98754d]"
                    : "text-[#d4b58b]"
                }`}
              >
                {item.number} / 02
              </span>

              <span className="mt-8 text-[10px] font-semibold tracking-[2.5px] opacity-60">
                {item.eyebrow}
              </span>

              <h3 className="mt-4 max-w-lg text-3xl font-medium leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
                {item.title}
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 opacity-70 sm:text-base sm:leading-8">
                {item.description}
              </p>

              <Link
                href={item.href}
                className={`group mt-8 inline-flex items-center gap-5 border px-6 py-4 text-[10px] font-semibold tracking-[1.5px] transition-colors duration-300 ${
                  item.theme === "light"
                    ? "border-[#24211e] bg-[#24211e] text-white hover:bg-transparent hover:text-[#24211e]"
                    : "border-white bg-white text-black hover:bg-transparent hover:text-white"
                }`}
              >
                {item.button}
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <span className="mt-12 text-[9px] tracking-[2px] opacity-40">
                MINICOM — DESIGNED FOR LIVING
              </span>
            </div>

            {/* Right image */}
            <div className="relative h-[300px] overflow-hidden sm:h-[400px] md:h-full md:min-h-[550px]">
              <img
                src={item.image}
                alt={item.imageAlt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

              <span className="absolute bottom-5 right-5 text-[9px] font-medium tracking-[2px] text-white drop-shadow">
                THE ART OF EVERYDAY LIVING
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
