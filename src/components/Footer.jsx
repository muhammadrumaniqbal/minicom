
"use client";

import { useState } from "react";

const shoppingLinks = [
  { label: "All Products", href: "/collections" },
  { label: "Living Room", href: "/collections/living-room" },
  { label: "Bedroom", href: "/collections/bedroom" },
  { label: "Dining Room", href: "/collections/dining-room" },
  { label: "Office Furniture", href: "/collections/office" },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
];

const supportLinks = [
  { label: "Contact Us", href: "/pages/contact" },
  { label: "About Us", href: "/pages/about" },
  { label: "FAQs", href: "/pages/faqs" },
  { label: "Shipping & Delivery", href: "/pages/shipping" },
  { label: "Returns & Refunds", href: "/pages/returns" },
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
];

function SocialIcon({ label, children }) {
  return (
    <a
      href="#social"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm transition hover:border-amber-600 hover:bg-amber-700"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubscribe(event) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage(
      "The form is ready, but newsletter signup needs to be connected to a service."
    );
  }

  return (
    <footer className="bg-[#171715] text-white">
      {/* Newsletter section */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 md:items-center lg:px-16 lg:py-16">
          <div>
            <p className="mb-3 text-[10px] tracking-[0.25em] text-amber-500">
              STAY IN THE LOOP
            </p>

            <h2 className="max-w-lg text-2xl font-light leading-snug sm:text-3xl lg:text-4xl">
              Inspiration for a more
              <span className="block font-semibold">
                beautiful everyday.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
              Sign up for design inspiration, new collections and special
              offers from Minicom.
            </p>
          </div>

          <div>
            <form
              onSubmit={handleSubscribe}
              className="flex border-b border-white/50 pb-3"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage("");
                }}
                placeholder="Enter your email address"
                required
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-white/40"
              />

              <button
                type="submit"
                className="ml-3 shrink-0 text-[10px] font-semibold tracking-[0.15em] text-amber-400 transition hover:text-white sm:text-xs"
              >
                SUBSCRIBE →
              </button>
            </form>

            {message && (
              <p
                role="status"
                className="mt-3 text-xs leading-5 text-amber-300"
              >
                {message}
              </p>
            )}

            <p className="mt-3 text-xs leading-5 text-white/40">
              By subscribing, you agree to receive updates from Minicom.
            </p>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-12 lg:px-16 lg:py-16">
        {/* Brand */}
        <div>
          <a href="/" className="inline-block">
            <span className="block text-4xl font-semibold tracking-[-0.08em]">
              M<span className="text-amber-600">.</span>
            </span>
            <span className="mt-1 block text-[9px] tracking-[0.35em]">
              MINICOM
            </span>
          </a>

          <p className="mt-6 max-w-xs text-sm leading-7 text-white/55">
            Thoughtfully designed furniture for the way you live. Discover
            timeless pieces that make your house feel like home.
          </p>

          <div className="mt-6 flex gap-3">
            <div className="mt-5 flex gap-3">
  <a
    href="https://www.instagram.com/"
    target="_blank"
    rel="noreferrer"
    aria-label="Instagram"
    className="border border-stone-200 px-3 py-2 text-sm transition hover:bg-stone-100"
  >
    Instagram
  </a>

  <a
    href="https://www.facebook.com/"
    target="_blank"
    rel="noreferrer"
    aria-label="Facebook"
    className="border border-stone-200 px-3 py-2 text-sm transition hover:bg-stone-100"
  >
    Facebook
  </a>
</div>
            <SocialIcon label="Pinterest">p</SocialIcon>
            <SocialIcon label="TikTok">tk</SocialIcon>
          </div>
        </div>

        {/* Shopping links */}
        <div>
          <h3 className="mb-6 text-xs font-semibold tracking-[0.18em]">
            SHOP
          </h3>

          <ul className="space-y-4">
            {shoppingLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-white/55 transition hover:text-amber-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer support */}
        <div>
          <h3 className="mb-6 text-xs font-semibold tracking-[0.18em]">
            CUSTOMER CARE
          </h3>

          <ul className="space-y-4">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-white/55 transition hover:text-amber-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact details */}
        <div>
          <h3 className="mb-6 text-xs font-semibold tracking-[0.18em]">
            GET IN TOUCH
          </h3>

          <p className="text-sm leading-7 text-white/55">
            Have a question about an order or a product? We'd love to help.
          </p>

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="mb-1 text-[10px] tracking-widest text-amber-500">
                EMAIL
              </p>
              <a
                href="mailto:hello@example.com"
                className="break-all text-white/70 transition hover:text-white"
              >
                hello@example.com
              </a>
            </div>

            <div>
              <p className="mb-1 text-[10px] tracking-widest text-amber-500">
                BUSINESS HOURS
              </p>
              <p className="leading-6 text-white/55">
                Monday – Saturday
                <br />
                9:00 AM – 6:00 PM
              </p>
            </div>

            <a
              href="/pages/contact"
              className="inline-flex items-center gap-3 border-b border-amber-600 pb-2 text-xs tracking-wider transition hover:text-amber-400"
            >
              CONTACT OUR TEAM <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-16">
          <p className="text-center text-xs text-white/40 md:text-left">
            © Minicom. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/45">
            <a href="/policies/privacy-policy" className="hover:text-white">
              Privacy
            </a>
            <a href="/policies/terms-of-service" className="hover:text-white">
              Terms
            </a>
            <a href="/policies/refund-policy" className="hover:text-white">
              Refund Policy
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/60">
            <span>Secure payments</span>
            <span className="rounded bg-white px-2 py-1 font-bold text-blue-800">
              VISA
            </span>
            <span className="rounded bg-white px-2 py-1 font-bold text-red-700">
              MC
            </span>
            <span className="rounded bg-white px-2 py-1 font-bold text-blue-700">
              Pay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
