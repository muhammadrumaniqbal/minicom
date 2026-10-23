"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import StackedCards from "@/components/StackCards";
import CategoryGrid from "@/components/CategoryGrid";
import { Search, Package, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function HomePage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] = await Promise.all([
          axios.get("/api/product"),
          axios.get("/api/category"),
        ]);

        setProducts(productResponse.data.res || []);

        setCategories(
          categoryResponse.data.res ||
            categoryResponse.data.data ||
            []
        );
      } catch (err) {
        console.error("Failed to load homepage data:", err);
        setError("We couldn't load the products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((product) =>
        (product.title || "")
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((product) => {
        const categoryId =
          typeof product.category === "object"
            ? product.category?._id
            : product.category;

        return String(categoryId) === String(selectedCategory);
      });
    }

    if (sort === "lowToHigh") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "highToLow") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
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
    <main className="min-h-screen bg-white text-stone-800">
      <CategoryGrid />

      <section
        id="products"
        className="mx-auto max-w-[1400px] scroll-mt-8 px-4 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-9 text-center"
        >
          <p className="mb-3 text-[10px] font-semibold tracking-[0.25em] text-stone-500">
            MADE FOR YOUR SPACE
          </p>

          <h2 className="text-3xl font-light tracking-wide sm:text-4xl">
            Discover our collection
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-stone-500">
            Find thoughtful pieces that bring warmth, comfort, and
            personality into your home.
          </p>
        </motion.div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center border border-stone-200 px-4 py-3">
            <Search
              size={18}
              className="mr-3 shrink-0 text-stone-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-stone-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="all">All categories</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-stone-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs text-stone-500">
            {loading
              ? "Loading collection..."
              : `${filteredProducts.length} products`}
          </p>

          {(search ||
            selectedCategory !== "all" ||
            sort !== "newest") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading && (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2
              size={34}
              className="animate-spin text-stone-600"
            />
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 border border-stone-800 px-5 py-3 text-xs font-semibold"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.map((product) => {
              const categoryName =
                typeof product.category === "object"
                  ? product.category?.title
                  : categories.find(
                      (category) =>
                        String(category._id) ===
                        String(product.category)
                    )?.title;

              return (
                <motion.div
                  key={product._id}
                  variants={cardVariants}
                >
                  <ProductCard
                    product={product}
                    categoryName={categoryName}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <StackedCards />

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="border border-dashed border-stone-300 px-6 py-16 text-center">
            <Package
              size={36}
              className="mx-auto mb-4 text-stone-400"
            />

            <h3 className="text-lg font-medium">
              No products found
            </h3>

            <p className="mt-2 text-sm text-stone-500">
              Try another search or select a different category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 border border-stone-800 px-5 py-3 text-xs font-semibold"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </section>
    </main>
  );
}