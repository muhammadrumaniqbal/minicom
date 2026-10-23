
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    eyebrow: "DESIGNED FOR LIVING",
    title: "Transform Your Home",
    highlight: "With Timeless Furniture",
    description:
      "Discover thoughtfully designed furniture that brings comfort, character and beauty into every corner of your home.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85",
    button: "EXPLORE COLLECTION",
  },
  {
    eyebrow: "COMFORT MEETS DESIGN",
    title: "Make Room For",
    highlight: "Beautiful Living",
    description:
      "Create a space that feels like you with carefully selected pieces for modern living.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85",
    button: "SHOP FURNITURE",
  },
  {
    eyebrow: "NATURALLY SIMPLE",
    title: "Bring Warmth",
    highlight: "Into Your Space",
    description:
      "Natural textures, timeless silhouettes and beautiful details made for everyday living.",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2200&q=85",
    button: "DISCOVER MORE",
  },
];

// Animation for the text container.
const textVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Animation for individual text elements.
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  function changeSlide(direction) {
    setActiveSlide(
      (current) =>
        (current + direction + slides.length) % slides.length
    );
  }

  // Automatically change slides every 5 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[activeSlide];

  return (
    <section className="bg-white">
      <div className="relative min-h-[490px] overflow-hidden bg-neutral-800 sm:min-h-[560px] lg:min-h-[650px]">

        {/* Animated background image */}
        <AnimatePresence initial={false}>
          <motion.img
            key={slide.image}
            src={slide.image}
            alt="Beautiful modern furniture in a thoughtfully designed living room"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 5, ease: "linear" },
            }}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        {/* Animated slide text */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.title}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -8 }}
            className="absolute bottom-16 left-5 z-10 max-w-[300px] text-white sm:bottom-20 sm:left-10 sm:max-w-sm lg:bottom-20 lg:left-14"
          >
            <motion.p
              variants={itemVariants}
              className="mb-2 text-[8px] font-medium tracking-[0.22em] text-white/80 sm:text-[9px]"
            >
              {slide.eyebrow}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="text-xl font-light leading-tight tracking-tight sm:text-2xl lg:text-3xl"
            >
              {slide.title}
              <span className="block font-semibold">
                {slide.highlight}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-2 max-w-[270px] text-[10px] leading-4 text-white/80 sm:text-xs sm:leading-5"
            >
              {slide.description}
            </motion.p>

            <motion.a
              variants={itemVariants}
              href="#products"
              whileHover={{
                y: -3,
                backgroundColor: "#b45309",
                color: "#ffffff",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-4 inline-flex items-center gap-3 bg-white px-4 py-2.5 text-[8px] font-semibold tracking-[0.12em] !text-neutral-900 sm:text-[9px]"
            >
              <span>{slide.button}</span>
              <motion.span
                aria-hidden="true"
                whileHover={{ x: 4 }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </AnimatePresence>

        {/* Slider controls */}
        <div className="absolute bottom-5 right-4 z-20 flex items-center gap-2 text-white sm:bottom-7 sm:right-8 sm:gap-4 lg:right-14">
          <motion.button
            type="button"
            onClick={() => changeSlide(-1)}
            aria-label="Previous slide"
            whileHover={{ x: -3, color: "#fcd34d" }}
            whileTap={{ scale: 0.9 }}
            className="p-1 text-lg sm:text-xl"
          >
            ‹
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.span
              key={activeSlide}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[9px] tracking-widest"
            >
              0{activeSlide + 1}
            </motion.span>
          </AnimatePresence>

          <div className="h-px w-10 bg-white/50 sm:w-20">
            <motion.div
              className="h-px bg-white"
              animate={{
                width: `${((activeSlide + 1) / slides.length) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          <span className="text-[9px] tracking-widest text-amber-300">
            0{slides.length}
          </span>

          <motion.button
            type="button"
            onClick={() => changeSlide(1)}
            aria-label="Next slide"
            whileHover={{ x: 3, color: "#fcd34d" }}
            whileTap={{ scale: 0.9 }}
            className="p-1 text-lg sm:text-xl"
          >
            ›
          </motion.button>
        </div>
      </div>

      {/* Animated benefits strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="border-b border-neutral-100 bg-white"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3 sm:gap-x-8">
          {[
            "♧ CASH ON DELIVERY",
            "◈ SECURE PAYMENT",
            "⚒ FREE INSTALLATION",
            "♧ FAST DELIVERY",
          ].map((benefit, index) => (
            <motion.span
              key={benefit}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="text-[8px] font-medium tracking-wide text-neutral-700"
            >
              {benefit}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
