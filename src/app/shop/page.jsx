"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

export default function ShopPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  // Read the search query passed from the navbar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") || "");
  }, []);

  // Fetch products and categories.
  useEffect(() => {
    async function fetchShopData() {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] = await Promise.all([
          axios.get("/api/product"),
          axios.get("/api/category"),
        ]);

        setProducts(
          Array.isArray(productResponse.data.res)
            ? productResponse.data.res
            : []
        );

        const categoryData =
          categoryResponse.data.res ||
          categoryResponse.data.categories ||
          categoryResponse.data.data ||
          categoryResponse.data;

        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (err) {
        console.error("Failed to load shop:", err);
        setError("We couldn't load the products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchShopData();
  }, []);

  // Filter and sort products.
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const category =
        typeof product.category === "object" ? product.category : null;

      const categoryTitle = String(category?.title || "").toLowerCase();

      const matchesSearch =
        !query ||
        String(product.title || "").toLowerCase().includes(query) ||
        categoryTitle.includes(query) ||
        String(product.desc || "").toLowerCase().includes(query);

      const categoryId = category?._id || product.category || "";

      const matchesCategory =
        selectedCategory === "all" ||
        String(categoryId) === String(selectedCategory);

      return matchesSearch && matchesCategory;
    });

    result = [...result];

    if (sort === "lowToHigh") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sort === "highToLow") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }

    return result;
  }, [products, search, selectedCategory, sort]);

  function getProductImage(product) {
    return (
      (typeof product.image === "string" && product.image) ||
      (typeof product.images?.[0] === "string"
        ? product.images[0]
        : product.images?.[0]?.url) ||
      product.imageUrl ||
      product.thumbnail ||
      ""
    );
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  }

  // Preserve existing cart behavior.
  function handleAddToCart(product) {
    const stock =
      product.stock == null
        ? null
        : Math.max(0, Number(product.stock) || 0);

    if (stock !== null && stock < 1) {
      toast.error("This product is out of stock.");
      return;
    }

    const image = getProductImage(product);

    addToCart(
      {
        ...product,
        image,
        id: product._id || product.id,
        stock,
      },
      1
    );

    toast.success("Added to your cart!");
  }

  function clearFilters() {
    setSearch("");
    setSelectedCategory("all");
    setSort("newest");
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Shop heading */}
      <section className="border-b border-neutral-200 px-5 pb-8 pt-10 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1500px]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[4px] text-yellow-600">
            Discover Minicom
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Our Shop
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
            Explore our collection and find the perfect pieces for your space.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 md:px-12">
        {/* Search and filters */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or categories..."
              className="w-full rounded-sm border border-neutral-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-yellow-500"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                size={17}
                className="shrink-0 text-neutral-500"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
                className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-3 text-sm outline-none focus:border-yellow-500 sm:w-auto"
              >
                <option value="all">All categories</option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown
                size={17}
                className="shrink-0 text-neutral-500"
              />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
                className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-3 text-sm outline-none focus:border-yellow-500 sm:w-auto"
              >
                <option value="newest">Newest first</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product count */}
        {!loading && !error && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              Showing{" "}
              <span className="font-semibold text-neutral-900">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            {(search ||
              selectedCategory !== "all" ||
              sort !== "newest") && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-neutral-600 underline transition hover:text-yellow-600"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] rounded-sm bg-neutral-100" />
                <div className="mt-4 h-4 w-3/4 rounded bg-neutral-100" />
                <div className="mt-3 h-4 w-1/3 rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="py-20 text-center">
            <p className="text-neutral-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-400 hover:text-black"
            >
              Try again
            </button>
          </div>
        )}

        {/* Product grid with reusable wishlist cards */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-10">
            {filteredProducts.map((product) => {
              const categoryTitle =
                typeof product.category === "object"
                  ? product.category?.title
                  : categories.find(
                      (category) =>
                        String(category._id) === String(product.category)
                    )?.title;

              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  categoryName={categoryTitle}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
        )}

        {/* No products found */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <Package size={35} className="text-neutral-300" />

            <h2 className="mt-4 text-xl font-semibold">
              No products found
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
              Try another search term or choose a different category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              View all products
            </button>
          </div>
        )}
      </section>
    </main>
  );
}