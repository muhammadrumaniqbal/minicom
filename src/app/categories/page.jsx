
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  ArrowRight,
  LayoutGrid,
  Sofa,
  BedDouble,
  Armchair,
  Lamp,
  Package,
  RefreshCw,
} from "lucide-react";

const categoryIcons = [Sofa, BedDouble, Armchair, Lamp, Package];

const categoryDescriptions = [
  "Bring comfort and character to your living space.",
  "Create a peaceful place to rest and recharge.",
  "Thoughtfully designed pieces for everyday living.",
  "Small details that make your home feel special.",
  "Explore more pieces for your perfect home.",
];

const categoryColors = [
  "bg-[#eee5d7]",
  "bg-[#e9e3dc]",
  "bg-[#e6e8df]",
  "bg-[#eee6d9]",
  "bg-[#e8e1d6]",
];

const defaultImages = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=85",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [categoryRes, productRes] = await Promise.all([
        axios.get("/api/category"),
        axios.get("/api/product"),
      ]);

      setCategories(categoryRes.data.res || []);
      setProducts(productRes.data.res || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("We couldn't load the categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const getProductCount = (category) =>
    products.filter((product) => {
      const productCategory = product.category;

      const categoryId =
        typeof productCategory === "object"
          ? productCategory?._id
          : productCategory;

      return categoryId?.toString() === category._id?.toString();
    }).length;

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.title
        ?.toLowerCase()
        .includes(search.trim().toLowerCase());

      const count = products.filter((product) => {
        const productCategory = product.category;
        const categoryId =
          typeof productCategory === "object"
            ? productCategory?._id
            : productCategory;

        return categoryId?.toString() === category._id?.toString();
      }).length;

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "available" && count > 0) ||
        (activeFilter === "empty" && count === 0);

      return matchesSearch && matchesFilter;
    });
  }, [categories, products, search, activeFilter]);

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#302c25]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#302c25] px-5 py-16 text-[#fffaf1] sm:px-8 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10 sm:h-[450px] sm:w-[450px]" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/10 sm:h-[350px] sm:w-[350px]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#d4b98d]"
          >
            <span className="h-px w-8 bg-[#d4b98d]" />
            Find your style
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          >
            Every room has
            <span className="block font-serif italic text-[#d4b98d]">
              a story to tell.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base"
          >
            Discover furniture made for the way you live. Explore our
            collections and find the perfect pieces for every corner of your
            home.
          </motion.p>

          <div className="mt-9 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="rounded-full border border-white/15 px-4 py-2">
              {loading ? "Discovering collections..." : `${categories.length} collections`}
            </span>
            <span className="rounded-full border border-white/15 px-4 py-2">
              {loading ? "Loading..." : `${products.length} products`}
            </span>
          </div>
        </div>
      </section>

      {/* Category explorer */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a58b61]">
              Explore the collection
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Shop by category
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#82796b]">
              Start with the room you're decorating, or browse all our
              collections to find something you love.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold transition hover:text-[#a58b61]"
          >
            View all products
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Search */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#e7dfd2] bg-[#fffdf9] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#928775]"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a category, e.g. bedroom..."
              className="w-full rounded-xl border border-[#e7dfd2] bg-[#faf7f1] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#a58b61] focus:ring-2 focus:ring-[#a58b61]/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <LayoutGrid size={17} className="mr-1 text-[#928775]" />

            {[
              { id: "all", label: "All categories" },
              { id: "available", label: "With products" },
              { id: "empty", label: "Coming soon" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full px-3.5 py-2.5 text-xs font-semibold transition sm:text-sm ${
                  activeFilter === filter.id
                    ? "bg-[#302c25] text-white shadow-sm"
                    : "bg-[#f1eadd] text-[#746b5b] hover:bg-[#e6dac7]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <RefreshCw className="animate-spin text-[#a58b61]" size={30} />
            <p className="text-sm text-[#82796b]">
              Finding the perfect collections for you...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-white p-10 text-center">
            <p className="font-semibold text-red-800">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 rounded-xl bg-[#302c25] px-5 py-3 text-sm text-white transition hover:bg-[#a58b61]"
            >
              Try again
            </button>
          </div>
        )}

        {/* Interactive category cards */}
        {!loading && !error && filteredCategories.length > 0 && (
          <motion.div
            layout
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCategories.map((category, index) => {
              const Icon = categoryIcons[index % categoryIcons.length];
              const count = getProductCount(category);
              const image = defaultImages[index % defaultImages.length];

              return (
                <motion.article
                  layout
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.06, 0.3),
                  }}
                  className="group"
                >
                  <Link
                    href={`/shop?category=${category._id}`}
                    className="block h-full overflow-hidden rounded-2xl border border-[#e7dfd2] bg-[#fffdf9] transition duration-300 hover:-translate-y-1 hover:border-[#c8b18e] hover:shadow-xl hover:shadow-[#302c25]/[0.07]"
                  >
                    <div className="relative h-60 overflow-hidden sm:h-64">
                      <img
                        src={image}
                        alt={category.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#201b16]/65 via-transparent to-black/5" />

                      <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/90 text-[#514638] shadow-sm backdrop-blur-sm">
                        <Icon size={20} strokeWidth={1.6} />
                      </div>

                      <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                        {count} {count === 1 ? "item" : "items"}
                      </div>

                      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-white">
                        <div>
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                            Collection {String(index + 1).padStart(2, "0")}
                          </p>
                          <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
                            {category.title}
                          </h3>
                        </div>

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f4e6cd] text-[#302c25] transition duration-300 group-hover:rotate-45 group-hover:bg-white">
                          <ArrowUpRight size={20} />
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-5">
                      <div>
                        <p className="text-sm leading-6 text-[#82796b]">
                          {categoryDescriptions[index % categoryDescriptions.length]}
                        </p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#a58b61]">
                          {count > 0 ? "Explore collection" : "Discover category"}
                        </p>
                      </div>
                      <ArrowRight
                        size={18}
                        className="shrink-0 text-[#a58b61] transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* No results */}
        {!loading && !error && filteredCategories.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#e7dfd2] bg-[#fffdf9] px-5 py-16 text-center">
            <Search size={32} className="mx-auto text-[#a58b61]" />
            <h3 className="mt-4 text-xl font-semibold">
              No categories found
            </h3>
            <p className="mt-2 text-sm text-[#82796b]">
              Try a different search or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveFilter("all");
              }}
              className="mt-5 rounded-xl bg-[#302c25] px-5 py-3 text-sm text-white transition hover:bg-[#a58b61]"
            >
              Show all categories
            </button>
          </div>
        )}
      </section>

      {/* Bottom call to action */}
      <section className="px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-[#e9dfcf] p-7 sm:p-10 md:flex-row md:items-center lg:p-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#91754c]">
              Your home, your way
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Find the pieces that make it feel like home.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#746b5b]">
              Explore the full Minicom collection and discover your next
              favourite piece.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-[#302c25] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#a58b61]"
          >
            Explore all products
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
